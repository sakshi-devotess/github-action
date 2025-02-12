const fs = require("fs");
const path = require("path");

const languages = ["en", "sv"];
const i18nDir = path.join(process.env.GITHUB_WORKSPACE, "src/i18n");

const requiredTopLevelKeys = [
  "menu",
  "objects",
  "components",
  "metadata",
  "auth",
];

const allowedKeys = ["headingLabels", "attributes", "messages", "extraInfo"];

// Read and validate file existence and JSON structure
function validateFile(lang) {
  const filePath = path.join(i18nDir, `${lang}/language.json`);
  console.error(filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file for ${lang} does not exist.`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Invalid JSON in ${lang} file: ${error.message}`);
    process.exit(1);
  }
}

// Validate structure of JSON file
function validateObjectStructure(jsonObj) {
  const actualKeys = Object.keys(jsonObj);

  // Check for missing keys
  const missingKeys = requiredTopLevelKeys.filter(
    (key) => !actualKeys.includes(key)
  );
  if (missingKeys.length > 0) {
    console.error(
      `❌ Missing required top-level keys: ${missingKeys.join(", ")}`
    );
    return false;
  }

  // Check for unexpected keys
  const unexpectedKeys = actualKeys.filter(
    (key) => !requiredTopLevelKeys.includes(key)
  );
  if (unexpectedKeys.length > 0) {
    console.error(
      `❌ Unexpected top-level keys found: ${unexpectedKeys.join(", ")}`
    );
    return false;
  }

  if (!jsonObj?.objects || typeof jsonObj.objects !== "object") {
    throw new Error("Invalid JSON structure: Missing 'objects' key.");
  }

  const invalidEntries = [];

  Object.entries(jsonObj.objects).forEach(([key, value]) => {
    if (typeof value !== "object") return;
    const invalidKeys = Object.keys(value).filter(
      (k) => !allowedKeys.includes(k)
    );
    if (invalidKeys.length) invalidEntries.push({ key, invalidKeys });
  });

  if (invalidEntries.length) {
    console.error("❌ Invalid keys found in translation objects:");
    console.error(`👀 Allowed keys are: ${allowedKeys.join(", ")}`);
    invalidEntries.forEach(({ key, invalidKeys }) => {
      console.error(
        `  - Object '${key}': Invalid keys: ${invalidKeys.join(", ")}`
      );
    });
    return false;
  }

  return true;
}
// Check if a string is in camelCase
function isCamelCase(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
}

// Validate keys and values for camelCase and lowercase
function validateKeysAndValues(jsonObj) {
  const seenKeys = new Set();
  let isValid = true;

  function traverse(obj, prefix = "") {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = `${prefix}${key}`;

      // Validate that keys are in camelCase
      if (!isCamelCase(key)) {
        console.error(
          `❌ Key '${fullKey}' is not in camelCase or contains invalid characters.`
        );
        isValid = false;
      }

      // Check for duplicate keys
      if (seenKeys.has(fullKey)) {
        console.error(`❌ Duplicate key found: '${fullKey}'.`);
        isValid = false;
      } else {
        seenKeys.add(fullKey);
      }

      if (typeof value === "string") {
        // Allow capital letters in 'components' and 'messages' keys
        const allowCapitalization =
          fullKey.startsWith("components.") || fullKey.includes(".messages.");

        // Validate that values are entirely lowercase
        value = value.replace(/\{\{[^}]+\}\}/g, ""); // Remove variables

        if (!allowCapitalization && value !== value.toLowerCase()) {
          console.error(
            `❌ Value for key '${fullKey}' contains uppercase characters: '${value}'.`
          );
          isValid = false;
        }
      } else if (typeof value === "object" && value !== null) {
        // Recurse for nested objects
        traverse(value, `${fullKey}.`);
      }
    });
  }

  traverse(jsonObj);
  return isValid;
}

// Extract all keys from nested objects
function extractKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? extractKeys(value, `${prefix}${key}.`)
      : `${prefix}${key}`
  );
}

// Compare keys between two language files
function validateKeyConsistency(enData, svData) {
  const enKeys = extractKeys(enData);
  const svKeys = extractKeys(svData);

  const missingInSv = enKeys.filter((key) => !svKeys.includes(key));
  const missingInEn = svKeys.filter((key) => !enKeys.includes(key));

  if (missingInSv.length || missingInEn.length) {
    console.error("❌ Key mismatch between translations:");
    if (missingInSv.length)
      console.error(`  - Missing in 'sv': ${missingInSv.join(", ")}`);
    if (missingInEn.length)
      console.error(`  - Missing in 'en': ${missingInEn.join(", ")}`);
    return false;
  }

  return true;
}

// Main validation process
function validateTranslations() {
  const files = {};

  // Validate file existence and JSON Validity
  languages.forEach((lang) => {
    console.log(`🔍 Validating ${lang} file...`);
    files[lang] = validateFile(lang);
  });

  // Validate structure of each language file
  let allValid = true;
  languages.forEach((lang) => {
    console.log(`🔍 Checking structure of ${lang} file...`);
    if (!validateObjectStructure(files[lang])) allValid = false;

    console.log(`🔍 Validating keys and values of ${lang} file...`);
    if (!validateKeysAndValues(files[lang])) allValid = false;
  });

  // Validate key consistency between languages
  console.log('🔍 Comparing keys between "en" and "sv"...');
  if (!validateKeyConsistency(files.en, files.sv)) allValid = false;

  if (allValid) {
    console.log("✅ All validations passed!");
    process.exit(0);
  } else {
    console.error("❌ Validation failed.");
    process.exit(1);
  }
}

// Run validation
validateTranslations();
