
# TaskFlow 🚀

A tiny team task-manager web app used to learn a **real-world CI/CD pipeline**:
GitHub branches → pull request → code review → tests → approval → deploy to AWS.

## The pipeline

```
feature branch ──▶ Pull Request ──▶ Tests (GitHub Actions)
                                        │
                          Lead reviews & approves PR
                                        │
                                  merge to main
                                        │
                        Deploy to STAGING (automatic, AWS S3+CloudFront)
                                        │
                        Lead approves in GitHub (manual gate)
                                        │
                        Deploy to PRODUCTION (automatic)
```

## Run locally

Just open `index.html` in your browser. Tasks are saved in localStorage.

## Run the tests

```bash
node --test tests/
```

## What's inside

| Path | What it is |
|---|---|
| `index.html`, `css/`, `js/` | The application |
| `tests/` | Unit tests run by CI on every PR |
| `.github/workflows/ci-cd.yml` | The CI/CD pipeline (GitHub Actions) |
| `infra/` | AWS setup files (IAM trust/permission policies, bucket policies, CloudFront config) |

> ⚠️ `infra/` files contain `<PLACEHOLDERS>` — replace them with your real
> values while following the guide. They are **not** uploaded to the website
> (the pipeline excludes them), because they identify your AWS account.
=======

