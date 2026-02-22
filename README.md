# bryandeleon.com

Personal website and resume. Static HTML/CSS/JS, deployed to AWS via CloudFront + S3.

## Local Development

Open `index.html` in a browser. No build step.

```bash
open index.html
open resume.html
```

## Project Structure

```
index.html          Main single-page website
resume.html         Standalone printable resume
style.css           Site styles
script.js           Scroll animations, nav behavior
infrastructure/
  template.yaml     CloudFormation stack (S3, CloudFront, ACM, Route 53, IAM)
  deploy-stack.sh   One-time bootstrap script
.github/
  workflows/
    deploy.yml      GitHub Actions — deploys on push to main
```

## Deployment

### First-time setup

Requires AWS CLI configured with sufficient IAM permissions.

```bash
chmod +x infrastructure/deploy-stack.sh
./infrastructure/deploy-stack.sh
```

This creates all AWS resources and prints three values. Add them as secrets in your GitHub repo (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | printed by script |
| `S3_BUCKET` | printed by script |
| `CLOUDFRONT_DISTRIBUTION_ID` | printed by script |

First run takes 15–30 minutes — ACM certificate DNS validation and CloudFront global propagation are the slow parts.

### Deploying changes

Push to `main`. GitHub Actions syncs files to S3 and invalidates the CloudFront cache automatically.

```bash
git add .
git commit -m "your message"
git push
```

### DNS troubleshooting

If ACM certificate validation is stuck, verify the hosted zone NS records match what the .com TLD has on file:

```bash
# What your hosted zone says
aws route53 list-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --query "ResourceRecordSets[?Type=='NS'].ResourceRecords[].Value"

# What the .com TLD registry has
dig NS bryandeleon.com @a.gtld-servers.net
```

If they differ, update the nameservers in Route 53 → Registered Domains → bryandeleon.com to match the hosted zone.
