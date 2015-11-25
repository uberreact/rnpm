const path = require('path');
const xml = require('xmldoc');
const fs = require('fs');
const efs = require('../utils/fs');

// Default android source directory to look for files
const BASE_DIR = './android';

const getSourceDirectory = (folder) => {
  var src = path.join(folder, BASE_DIR);

  if (!fs.existsSync(src)) {
    return null;
  }

  if (fs.existsSync(path.join(src, 'app'))) {
    src = path.join(src, 'app');
  }

  return src;
};

const getPackageName = (src) => {
  const manifest = new xml.XmlDocument(
    efs.loadFile(path.join(src, 'src/main/AndroidManifest.xml'))
  );

  return manifest.attr.package;
};

const getPackageFolder = (packageName) => packageName.replace('.', path.sep);

exports.projectConfig = function projectConfigAndroid(folder, userConfig) {
  const src = userConfig.sourceDir || getSourceDirectory(folder);

  if (!src) {
    return null;
  }

  const packageName = userConfig.packageName || getPackageName(src);
  const packageFolder = userConfig.packageFolder || getPackageFolder(packageName);

  return {
    src: src,
    folder: folder,
    project: path.join(src, 'build.gradle'),
    settings: path.join(BASE_DIR, 'settings.gradle'),
    mainActivity: path.join(src, `src/main/java/${packageFolder}/MainActivity.java`),
  };
};

exports.dependencyConfig = function dependencyConfigAndroid(folder, userConfig) {
  const src = userConfig.sourceDir || getSourceDirectory(folder);

  if (!src) {
    return null;
  }

  const packageName = userConfig.packageName || getPackageName(src);

  return {
    src: src,
    folder: folder,
    packageImportPath: `import ${packageName}.Package`,
    packageInstance: ` new ${packageName}()`,
  };
};
