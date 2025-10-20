export type GrowthPoint = {
    year: number;
    simple: number;
    compound: number;
};

export type ContributionPoint = {
    year: number;
    total: number;
    contributions: number;
    interest: number;
};

export type TimingPoint = {
    year: number;
    early: number;
    late: number;
};

export function generateGrowthSeries({
    principal,
    rate,
    years,
    frequency
}: {
    principal: number;
    rate: number;
    years: number;
    frequency: number;
}): GrowthPoint[] {
    const cleanPrincipal = Math.max(principal, 0);
    const cleanRate = Math.max(rate, 0);
    const cleanYears = Math.max(Math.floor(years), 0);
    const cleanFrequency = Math.max(Math.floor(frequency), 1);

    const points: GrowthPoint[] = [];

    for (let year = 0; year <= cleanYears; year += 1) {
        const simple = cleanPrincipal * (1 + cleanRate * year);
        const compound =
            cleanPrincipal * Math.pow(1 + cleanRate / cleanFrequency, cleanFrequency * year);

        points.push({
            year,
            simple,
            compound
        });
    }

    return points;
}

export function simulateContributionGrowth({
    initial,
    monthly,
    annualBonus,
    rate,
    years
}: {
    initial: number;
    monthly: number;
    annualBonus: number;
    rate: number;
    years: number;
}): ContributionPoint[] {
    const cleanedYears = Math.max(Math.floor(years), 0);
    const monthlyRate = Math.max(rate, 0) / 12;
    const monthlyDeposit = Math.max(monthly, 0);
    const bonus = Math.max(annualBonus, 0);
    let balance = Math.max(initial, 0);
    let contributions = balance;

    const timeline: ContributionPoint[] = [
        {
            year: 0,
            total: balance,
            contributions,
            interest: balance - contributions
        }
    ];

    for (let year = 1; year <= cleanedYears; year += 1) {
        for (let month = 0; month < 12; month += 1) {
            balance *= 1 + monthlyRate;
            if (monthlyDeposit > 0) {
                balance += monthlyDeposit;
                contributions += monthlyDeposit;
            }
        }

        if (bonus > 0) {
            balance += bonus;
            contributions += bonus;
        }

        timeline.push({
            year,
            total: balance,
            contributions,
            interest: balance - contributions
        });
    }

    return timeline;
}

export function simulateStartTiming({
    monthly,
    yearsInvesting,
    delayYears,
    rate,
    horizonYears
}: {
    monthly: number;
    yearsInvesting: number;
    delayYears: number;
    rate: number;
    horizonYears: number;
}): TimingPoint[] {
    const monthlyRate = Math.max(rate, 0) / 12;
    const totalMonths = Math.max(Math.floor(horizonYears * 12), 0);
    const investingMonths = Math.max(Math.floor(yearsInvesting * 12), 0);
    const lagMonths = Math.max(Math.floor(delayYears * 12), 0);
    const deposit = Math.max(monthly, 0);

    let earlyBalance = 0;
    let lateBalance = 0;

    const points: TimingPoint[] = [
        { year: 0, early: earlyBalance, late: lateBalance }
    ];

    for (let month = 1; month <= totalMonths; month += 1) {
        earlyBalance *= 1 + monthlyRate;
        lateBalance *= 1 + monthlyRate;

        if (month <= investingMonths) {
            earlyBalance += deposit;
        }

        if (month > lagMonths && month <= lagMonths + investingMonths) {
            lateBalance += deposit;
        }

        if (month % 12 === 0) {
            const currentYear = month / 12;
            points.push({
                year: currentYear,
                early: earlyBalance,
                late: lateBalance
            });
        }
    }

    return points;
}
