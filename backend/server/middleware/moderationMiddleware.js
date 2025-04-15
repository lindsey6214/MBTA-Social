const {
  moderateContent,
  censorContent,
  preprocessText,
} = require("../utilities/openaiService");

const customFlaggedWords = require("../utilities/customFlags");

const moderationMiddleware = async (req, res, next) => {
  try {
    const fieldsToModerate = ["content", "commentContent", "biography"];
    let fieldFound = null;

    // Check if there is any content to moderate
    for (const field of fieldsToModerate) {
      if (req.body[field]) {
        fieldFound = field;
        break;
      }
    }

    // If no moderatable field is found, proceed to the next middleware
    if (!fieldFound) return next();

    const originalText = req.body[fieldFound];
    const preProcessedText = preprocessText(originalText);

    // Run moderation check
    const moderationResult = await moderateContent(preProcessedText);

    // Validate the moderation result
    if (!moderationResult || typeof moderationResult !== "object") {
      console.error("⚠️ Invalid moderation response:", moderationResult);
      return res.status(500).json({ error: "Moderation service failed." });
    }

    const { categories = {} } = moderationResult;

    // Define severe content categories
    const severeCategories = [
      "hate",
      "hate/threatening",
      "self-harm",
      "sexual",
      "sexual/minors",
      "violence",
      "violence/graphic",
    ];

    // Check for severe content in the moderation categories
    const isSevere = severeCategories.some((category) => categories[category]);

    if (isSevere) {
      return res.status(400).json({
        error: "Your content contains disallowed content and cannot be submitted.",
        categories: severeCategories.filter((category) => categories[category]),
      });
    }

    // Run censorship on the content
    const censoredContent = await censorContent(preProcessedText, customFlaggedWords);

    // Update the original field with censored text
    req.body[fieldFound] = censoredContent;

    // Attach moderation metadata to the request for further use
    req.moderation = moderationResult;
    req.censored = originalText !== censoredContent;

    // Log in non-prod environments
    if (process.env.NODE_ENV !== "production") {
      console.log("🧠 Moderation categories:", categories);
      if (req.censored) console.log(`✂️ Censored content for '${fieldFound}'`);
    }

    next();
  } catch (error) {
    console.error("❌ Error in moderation middleware:", error);
    res.status(500).json({ error: "An error occurred during content moderation." });
  }
};

module.exports = moderationMiddleware;