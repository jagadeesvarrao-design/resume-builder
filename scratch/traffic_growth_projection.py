import math

# Current traffic data points:
# Day 0 (July 11): 52 monthly users
# Day 6 (July 17): 61 monthly users
# Target: 10,000 users per day = 300,000 monthly users

N0 = 52.0
N1 = 61.0
days = 6.0

# Calculate compounding growth rate per day:
# N1 = N0 * (1 + r_day)^days
# (1 + r_day) = (N1/N0)^(1/days)
r_day = (N1 / N0) ** (1.0 / days) - 1.0
r_monthly = (1.0 + r_day) ** 30.0 - 1.0

print(f"Daily growth rate: {r_day:.4f} ({r_day*100:.2f}%)")
print(f"Monthly growth rate: {r_monthly:.4f} ({r_monthly*100:.2f}%)")

# Calculate time to reach 10,000 users per day (300,000 monthly users) starting from N1 (61 users)
target_monthly = 300000.0

# Exponential growth formula: Target = Current * (1 + r_day)^t_days
# t_days = log(Target / Current) / log(1 + r_day)
t_days_exp = math.log(target_monthly / N1) / math.log(1.0 + r_day)
t_months_exp = t_days_exp / 30.0

print(f"\nExponential Growth Projection:")
print(f"Days: {t_days_exp:.1f} days")
print(f"Months: {t_months_exp:.1f} months")

# Let's run a moderate exponential scenario (e.g. 20% compounding monthly growth rate, which is more realistic for steady search engine indexing growth)
r_moderate = 0.20
t_months_moderate = math.log(target_monthly / N1) / math.log(1.0 + r_moderate)
print(f"\nModerate Growth Projection (20% monthly compounding):")
print(f"Months: {t_months_moderate:.1f} months ({t_months_moderate/12.0:.1f} years)")
