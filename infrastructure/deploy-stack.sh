#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# deploy-stack.sh — One-time bootstrap for bryandeleon.com on AWS
#
# Run this once from your local machine to create all AWS resources.
# After it completes, copy the printed values into GitHub secrets.
#
# Prerequisites:
#   - AWS CLI configured (aws configure, or AWS_PROFILE env var set)
#   - IAM permissions: CloudFormation, S3, CloudFront, ACM, Route53, IAM
#   - The repo pushed to GitHub before running (needed for OIDC sub claim)
#
# Usage:
#   chmod +x infrastructure/deploy-stack.sh
#   ./infrastructure/deploy-stack.sh
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="bryandeleon.com"
GITHUB_ORG="bdeleon"
GITHUB_REPO="bryan-website"
STACK_NAME="bryandeleon-website"
REGION="us-east-1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "==> Deploying ${DOMAIN} to AWS"
echo "    Stack:  ${STACK_NAME}"
echo "    Region: ${REGION}"
echo ""

# ── Look up Route 53 Hosted Zone ID ──────────────────────────────
echo "==> Looking up Route 53 Hosted Zone ID for ${DOMAIN}..."

HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "${DOMAIN}." \
  --query "HostedZones[?Name=='${DOMAIN}.'].Id" \
  --output text | sed 's|/hostedzone/||')

if [ -z "$HOSTED_ZONE_ID" ]; then
  echo "    ERROR: No hosted zone found for ${DOMAIN}"
  echo "    Make sure the domain is registered in Route 53 in this AWS account."
  exit 1
fi

echo "    HostedZoneId: ${HOSTED_ZONE_ID}"

# ── Check for Existing GitHub OIDC Provider ──────────────────────
echo ""
echo "==> Checking for existing GitHub Actions OIDC provider..."

EXISTING_PROVIDER=$(aws iam list-open-id-connect-providers \
  --query "OpenIDConnectProviderList[?ends_with(Arn, 'token.actions.githubusercontent.com')].Arn" \
  --output text)

if [ -n "$EXISTING_PROVIDER" ]; then
  echo "    Found existing OIDC provider — skipping creation."
  CREATE_OIDC="false"
else
  echo "    No existing OIDC provider found — will create one."
  CREATE_OIDC="true"
fi

# ── Deploy CloudFormation Stack ───────────────────────────────────
echo ""
echo "==> Deploying CloudFormation stack..."
echo "    Note: First run takes 15-30 minutes."
echo "    (ACM cert validation ~5-10 min, CloudFront propagation ~15-20 min)"
echo ""

aws cloudformation deploy \
  --region "${REGION}" \
  --stack-name "${STACK_NAME}" \
  --template-file "${SCRIPT_DIR}/template.yaml" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    DomainName="${DOMAIN}" \
    HostedZoneId="${HOSTED_ZONE_ID}" \
    GitHubOrg="${GITHUB_ORG}" \
    GitHubRepo="${GITHUB_REPO}" \
    CreateGitHubOIDCProvider="${CREATE_OIDC}"

# ── Fetch Stack Outputs ───────────────────────────────────────────
get_output() {
  aws cloudformation describe-stacks \
    --region "${REGION}" \
    --stack-name "${STACK_NAME}" \
    --query "Stacks[0].Outputs[?OutputKey=='${1}'].OutputValue" \
    --output text
}

ROLE_ARN=$(get_output "DeployRoleArn")
BUCKET=$(get_output "S3BucketName")
DIST_ID=$(get_output "CloudFrontDistributionId")
WEBSITE_URL=$(get_output "WebsiteURL")

# ── Print Results ─────────────────────────────────────────────────
echo ""
echo "================================================================"
echo "  Stack deployed successfully!"
echo ""
echo "  Website: ${WEBSITE_URL}"
echo ""
echo "  Add these 3 secrets to your GitHub repo:"
echo "  (Settings > Secrets and variables > Actions > New repository secret)"
echo ""
echo "  AWS_DEPLOY_ROLE_ARN          ${ROLE_ARN}"
echo "  S3_BUCKET                    ${BUCKET}"
echo "  CLOUDFRONT_DISTRIBUTION_ID   ${DIST_ID}"
echo "================================================================"
echo ""
echo "  Once secrets are set, push to main to trigger your first deploy."
echo ""
