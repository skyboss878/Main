const fs = require('fs');
const path = './src/pages/Dashboard.jsx';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read Dashboard.jsx:', err);
    return;
  }

  let content = data;

  // 1. Add import if missing
  if (!content.includes("import CreateVideoModal")) {
    content = content.replace(
      /import React.*?;\n/,
      (match) => match + "import CreateVideoModal from '../components/CreateVideoModal';\n"
    );
    console.log('Added CreateVideoModal import.');
  }

  // 2. Add useState import if missing
  if (!content.includes("useState")) {
    content = content.replace(
      /import React(.*?);/,
      (match, p1) => `import React${p1}, { useState } from 'react';`
    );
    console.log('Added useState import.');
  }

  // 3. Add showCreateModal state if missing
  if (!content.includes("const [showCreateModal")) {
    content = content.replace(
      /(const Dashboard =.*?=>\s*{)/s,
      (match) =>
        `${match}\n  const [showCreateModal, setShowCreateModal] = useState(false);\n`
    );
    console.log('Added showCreateModal state.');
  }

  // 4. Add handleCreateVideo if missing
  if (!content.includes("function handleCreateVideo") && !content.includes("const handleCreateVideo")) {
    content = content.replace(
      /(const Dashboard =.*?=>\s*{)/s,
      (match) =>
        `${match}\n  const handleCreateVideo = (templateId) => {\n    console.log("Selected template:", templateId);\n    setShowCreateModal(true);\n  };\n`
    );
    console.log('Added handleCreateVideo function.');
  }

  // 5. Fix modal rendering block
  if (!content.includes("<CreateVideoModal onClose")) {
    // Remove old modal if exists
    content = content.replace(
      /{showCreateModal && <CreateVideoModal \/>}/g,
      ''
    );
    // Append correct modal rendering before last closing </div> of Dashboard (simplified)
    const closingDivIndex = content.lastIndexOf('</div>');
    if (closingDivIndex !== -1) {
      const before = content.slice(0, closingDivIndex);
      const after = content.slice(closingDivIndex);
      content = before + '\n  {showCreateModal && (\n    <CreateVideoModal onClose={() => setShowCreateModal(false)} />\n  )}\n' + after;
      console.log('Added modal rendering block.');
    }
  }

  // Write back the updated file
  fs.writeFile(path, content, 'utf8', (err) => {
    if (err) {
      console.error('Failed to write Dashboard.jsx:', err);
    } else {
      console.log('Dashboard.jsx updated successfully!');
    }
  });
});
