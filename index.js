const core = require("@actions/core");
const github = require("@actions/github");
const Netlify = require('netlify');

const run = async () => {
  try {
    const accessToken = core.getInput('access_token')
    const accountSlug = core.getInput('account_slug')
    const siteName = core.getInput('site_name')
    const maxTimeout = Number(core.getInput("timeout_secs")) || 60;
    const commitRef = core.getInput('commit_ref') || github.context.payload.head; // allow this input for testing only
    /*
      insert checks here, to fail if any of these inputs are invalid
    */
    const client = new Netlify(accessToken)
    const getDeployId = async () => {
      let sites, site, deploys, deploy;
      try {
        sites = await client.listSitesForAccount({account_slug: accountSlug});
        site = sites.find(site => site.name === siteName);
      } catch (e) {
        const errMsg = 'account slug or site name invalid';
        core.warning(errMsg);
        throw new Error(errMsg);
      }
      const iterations = maxTimeout / 3;
      for (let i = 0; i < iterations; i++) {
        try {
          deploys = await client.listSiteDeploys({ site_id: site.id });
          deploy = deploys.find(deploy => deploy.commit_ref === commitRef);
          return deploy.id;
        } catch (e) {
          core.warning('commit deploy not (yet) available; retrying in 3s')
          await new Promise(r => setTimeout(r, 3000));
        }
      }
      const errMsg = 'timed out: commit deploy was unavailable';
      core.warning(errMsg);
      throw new Error(errMsg);
    }
    core.info(`Waiting to resolve Netlify deploy ID from last commit`);
    const deployId = await getDeployId();
    const url = `https://${deployId}--${siteName}.netlify.app`;
    core.setOutput("url", url);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
