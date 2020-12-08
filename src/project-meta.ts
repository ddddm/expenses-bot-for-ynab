import readPackageUp = require('read-pkg-up');

export async function getProjectMeta() {
  const result = await readPackageUp();

  if (!result) {
    throw new Error('Unable to get project metadata');
  }

  const { packageJson } = result;
  const { version, description } = packageJson;

  return {
    version,
    description,
  };
}
