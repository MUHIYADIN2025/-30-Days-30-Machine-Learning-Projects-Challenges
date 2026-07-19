# Streaming Subscriber Churn Prediction & Revenue-at-Risk

Predicting which subscribers are likely to cancel, and translating that risk
into dollars — so retention teams know who to contact first.

## Overview

A subscription streaming service with **243,000+ customers** wants to reduce
churn. The goal of this project is twofold:

1. **Predict** which customers are likely to churn.
2. **Quantify** the revenue at risk from those customers, so retention
   outreach can be prioritized by business impact — not just by churn
   probability alone.

## Approach

- **Exploratory analysis**: churn patterns examined across subscription
  type, viewing hours, and account age to identify early behavioral signals.
- **Model**: Random Forest classifier with **balanced class weights**, since
  churn prediction is an imbalanced classification problem (most customers
  do *not* churn in a given period).
- **Evaluation metric**: **recall**, not accuracy. A model can score high
  accuracy by simply predicting "no churn" for everyone in an imbalanced
  dataset — that's useless for a retention team. Recall measures how many
  actual churners the model successfully catches, which is what the business
  actually needs.
- **Revenue-at-risk layer**: churn probabilities alone don't tell a business
  where to spend retention budget. This project multiplies each at-risk
  customer's predicted churn probability by their monthly charge to estimate
  expected revenue loss, then ranks customers by that figure. This is the
  step that turns a model output into a business decision.

## Why This Matters

> A machine learning model predicts behavior. Businesses make decisions
> using money. Translating churn probabilities into expected revenue is
> what connects the model to a real business decision.

A churn score by itself tells you *who might leave*. Revenue at risk tells
you *who is worth calling first*.

## Findings

- **18.1%** overall churn rate.
- **Basic-tier subscribers** churn at the highest rate of any subscription type.
- **Low viewing hours** and **short account age** are the strongest early
  warning signals of churn — customers who disengage early and stay on the
  service only briefly are the highest-risk segment.
- Model recall: `<fill in your actual recall score here>`
- Total estimated revenue at risk: `<fill in your total from your run here>`

## Limitations

- **No retention campaign cost data** is available, so no ROI or
  cost-per-retained-customer calculation is included — only revenue at risk,
  not net benefit of intervention.
- **Monthly charges span a narrow range ($5–$20)**, which limits how much
  revenue-at-risk actually differentiates between customers — a wider price
  range would make the prioritization layer more meaningful.
- **Model would need periodic retraining** as subscriber behavior evolves;
  this is a snapshot model, not a continuously updated one.

## Tech Stack

- Python, pandas, scikit-learn (Random Forest, class-weight balancing)
- `<add your visualization library — matplotlib/seaborn/plotly — if used>`
- `<add notebook or script name here>`

## Possible Next Steps

- Incorporate retention campaign cost data to calculate true ROI, not just
  revenue at risk.
- Test additional models (e.g. gradient boosting) and compare recall and
  precision trade-offs.
- Build a simple dashboard ranking at-risk customers by expected revenue
  loss, for a retention team to act on directly.