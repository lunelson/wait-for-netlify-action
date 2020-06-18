# Github Action: Wait for Netlify Deployment URL

If you have Github Actions which need to run tests (e.g. Lighthouse CI, Cypress, etc) against the latest _commit-specific_ Netlify deployment of your site, this action will wait for Netlify's internally generated _deployment ID_ before passing on the URL (`https://{deploy-id}--{site-name}.netlify.app/`) to the next task.

## How To Use It

1. Create a new __Personal Access Token__ for Netlify in your [user profile applications page](https://app.netlify.com/user/applications). If you are running this workflow in a public repository, you'll want to add this to your repo's secrets; otherwise you can paste it in to your workflow.
2. Note the relevant __Account Slug__ and __Site Name__. They can be found within the following URLs:
   * Account Slug: `https://app.netlify.com/teams/{account_slug}/sites`
   * Site Name: `https://{site_name}.netlify.app`

### Inputs

|Parameter||
|--|--|
|`access_token` *| Your Netlify Personal Access Token (required; see step 1) |
|`account_slug` *| Your Netlify Account Slug (required; see step 2) |
|`site_name` *| Your Netlify Site Name (required; see step 2) |
|`timeout_secs`| How long to keep polling for the deploy ID before timing out (optional; default: `60`) |

### Outputs
|Parameter||
|--|--|
|`url` | The commit-specific deployment URL for your site: `https://{deploy-id}--{site-name}.netlify.app/` |

## Example usage

Basic Usage

```yaml
```
