// Dynamic date generation utility for funnel templates
// Replaces static dates with contextual, dynamic dates

export interface DateOptions {
  timezone?: string;
  locale?: string;
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
}

export interface ScarcityDateConfig {
  daysFromNow?: number;
  hoursFromNow?: number;
  endOfDay?: boolean;
  workdaysOnly?: boolean;
}

export interface LaunchDateConfig {
  launchDate?: Date;
  prelaunchDays?: number;
  earlyAccessDays?: number;
}

export class DynamicDateGenerator {
  private timezone: string;
  private locale: string;

  constructor(timezone = 'America/New_York', locale = 'en-US') {
    this.timezone = timezone;
    this.locale = locale;
  }

  // Generate scarcity dates (sales endings, limited offers)
  generateScarcityDate(config: ScarcityDateConfig = {}): {
    date: Date;
    formatted: string;
    iso: string;
    countdown: string;
  } {
    const {
      daysFromNow = 3,
      hoursFromNow = 0,
      endOfDay = true,
      workdaysOnly = false
    } = config;

    let targetDate = new Date();
    
    if (workdaysOnly) {
      targetDate = this.addWorkdays(targetDate, daysFromNow);
    } else {
      targetDate.setDate(targetDate.getDate() + daysFromNow);
    }
    
    if (hoursFromNow > 0) {
      targetDate.setHours(targetDate.getHours() + hoursFromNow);
    }
    
    if (endOfDay) {
      targetDate.setHours(23, 59, 59, 999);
    }

    return {
      date: targetDate,
      formatted: this.formatDate(targetDate),
      iso: targetDate.toISOString(),
      countdown: this.generateCountdownText(targetDate)
    };
  }

  // Generate webinar dates
  generateWebinarDate(daysAhead = 7, timeSlot = '2:00 PM'): {
    date: Date;
    formatted: string;
    reminderDates: Date[];
  } {
    const webinarDate = new Date();
    webinarDate.setDate(webinarDate.getDate() + daysAhead);
    
    // Parse time slot
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    webinarDate.setHours(hour24, minutes || 0, 0, 0);

    // Generate reminder dates
    const reminderDates = [
      new Date(webinarDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
      new Date(webinarDate.getTime() - 60 * 60 * 1000), // 1 hour before
      new Date(webinarDate.getTime() - 15 * 60 * 1000), // 15 minutes before
    ];

    return {
      date: webinarDate,
      formatted: this.formatDate(webinarDate, { includeTime: true }),
      reminderDates
    };
  }

  // Generate launch sequence dates
  generateLaunchSequence(config: LaunchDateConfig = {}): {
    prelaunchStart: Date;
    earlyAccessStart: Date;
    publicLaunch: Date;
    formatted: {
      prelaunchStart: string;
      earlyAccessStart: string;
      publicLaunch: string;
    };
  } {
    const {
      launchDate,
      prelaunchDays = 14,
      earlyAccessDays = 7
    } = config;

    const publicLaunch = launchDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    
    const earlyAccessStart = new Date(publicLaunch);
    earlyAccessStart.setDate(earlyAccessStart.getDate() - earlyAccessDays);
    
    const prelaunchStart = new Date(publicLaunch);
    prelaunchStart.setDate(prelaunchStart.getDate() - prelaunchDays);

    return {
      prelaunchStart,
      earlyAccessStart,
      publicLaunch,
      formatted: {
        prelaunchStart: this.formatDate(prelaunchStart),
        earlyAccessStart: this.formatDate(earlyAccessStart),
        publicLaunch: this.formatDate(publicLaunch)
      }
    };
  }

  // Generate cohort/program dates
  generateCohortDates(cohortLength = 90, spotsRemaining = 10): {
    applicationDeadline: Date;
    cohortStart: Date;
    cohortEnd: Date;
    spotsRemaining: number;
    formatted: {
      applicationDeadline: string;
      cohortStart: string;
      cohortEnd: string;
    };
  } {
    const applicationDeadline = new Date();
    applicationDeadline.setDate(applicationDeadline.getDate() + 14);
    
    const cohortStart = new Date(applicationDeadline);
    cohortStart.setDate(cohortStart.getDate() + 7);
    
    const cohortEnd = new Date(cohortStart);
    cohortEnd.setDate(cohortEnd.getDate() + cohortLength);

    return {
      applicationDeadline,
      cohortStart,
      cohortEnd,
      spotsRemaining: Math.max(1, spotsRemaining - Math.floor(Math.random() * 3)),
      formatted: {
        applicationDeadline: this.formatDate(applicationDeadline),
        cohortStart: this.formatDate(cohortStart),
        cohortEnd: this.formatDate(cohortEnd)
      }
    };
  }

  // Generate seasonal campaign dates
  generateSeasonalDates(): {
    nextHoliday: string;
    seasonalOffer: Date;
    formatted: string;
  } {
    const holidays = this.getUpcomingHolidays();
    const nextHoliday = holidays[0];
    
    const seasonalOffer = new Date(nextHoliday.date);
    seasonalOffer.setDate(seasonalOffer.getDate() - 7); // Start offer 1 week before

    return {
      nextHoliday: nextHoliday.name,
      seasonalOffer,
      formatted: this.formatDate(seasonalOffer)
    };
  }

  // Utility: Add workdays only
  private addWorkdays(date: Date, days: number): Date {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }
    
    return result;
  }

  // Format date with options
  private formatDate(date: Date, options: DateOptions = {}): string {
    const {
      format = 'medium',
      includeTime = false
    } = options;

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone
    };

    switch (format) {
      case 'short':
        formatOptions.dateStyle = 'short';
        break;
      case 'medium':
        formatOptions.dateStyle = 'medium';
        break;
      case 'long':
        formatOptions.dateStyle = 'long';
        break;
      case 'full':
        formatOptions.dateStyle = 'full';
        break;
    }

    if (includeTime) {
      formatOptions.timeStyle = 'short';
    }

    return new Intl.DateTimeFormat(this.locale, formatOptions).format(date);
  }

  // Generate countdown text
  private generateCountdownText(targetDate: Date): string {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Offer Expired';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} days, ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes`;
    } else {
      return `${minutes} minutes`;
    }
  }

  // Get upcoming holidays
  private getUpcomingHolidays(): Array<{ name: string; date: Date }> {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const holidays = [
      { name: 'Valentine\'s Day', date: new Date(currentYear, 1, 14) },
      { name: 'Mother\'s Day', date: this.getNthWeekday(currentYear, 4, 0, 2) }, // 2nd Sunday in May
      { name: 'Father\'s Day', date: this.getNthWeekday(currentYear, 5, 0, 3) }, // 3rd Sunday in June
      { name: 'Independence Day', date: new Date(currentYear, 6, 4) },
      { name: 'Labor Day', date: this.getNthWeekday(currentYear, 8, 1, 1) }, // 1st Monday in September
      { name: 'Halloween', date: new Date(currentYear, 9, 31) },
      { name: 'Black Friday', date: this.getBlackFriday(currentYear) },
      { name: 'Cyber Monday', date: this.getCyberMonday(currentYear) },
      { name: 'Christmas', date: new Date(currentYear, 11, 25) },
      { name: 'New Year\'s Day', date: new Date(currentYear + 1, 0, 1) }
    ];

    return holidays
      .filter(holiday => holiday.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3); // Return next 3 holidays
  }

  // Helper to get nth weekday of month
  private getNthWeekday(year: number, month: number, weekday: number, n: number): Date {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (7 + weekday - firstDay.getDay()) % 7;
    return new Date(year, month, firstWeekday + (n - 1) * 7 + 1);
  }

  // Get Black Friday (4th Thursday of November + 1 day)
  private getBlackFriday(year: number): Date {
    const thanksgiving = this.getNthWeekday(year, 10, 4, 4); // 4th Thursday in November
    const blackFriday = new Date(thanksgiving);
    blackFriday.setDate(blackFriday.getDate() + 1);
    return blackFriday;
  }

  // Get Cyber Monday (Black Friday + 3 days)
  private getCyberMonday(year: number): Date {
    const blackFriday = this.getBlackFriday(year);
    const cyberMonday = new Date(blackFriday);
    cyberMonday.setDate(cyberMonday.getDate() + 3);
    return cyberMonday;
  }
}

// Utility functions for template integration
export function generateDynamicContent(templateType: string): Record<string, any> {
  const dateGen = new DynamicDateGenerator();
  
  switch (templateType) {
    case 'flash-sale':
      const scarcity = dateGen.generateScarcityDate({ daysFromNow: 2, hoursFromNow: 12 });
      return {
        endDate: scarcity.iso,
        endDateFormatted: scarcity.formatted,
        countdownText: scarcity.countdown
      };
      
    case 'webinar':
      const webinar = dateGen.generateWebinarDate(7, '2:00 PM');
      return {
        webinarDate: webinar.date.toISOString(),
        webinarDateFormatted: webinar.formatted,
        reminderDates: webinar.reminderDates.map(d => d.toISOString())
      };
      
    case 'product-launch':
      const launch = dateGen.generateLaunchSequence();
      return {
        prelaunchStart: launch.prelaunchStart.toISOString(),
        earlyAccessStart: launch.earlyAccessStart.toISOString(),
        publicLaunch: launch.publicLaunch.toISOString(),
        formatted: launch.formatted
      };
      
    case 'coaching-program':
      const cohort = dateGen.generateCohortDates();
      return {
        applicationDeadline: cohort.applicationDeadline.toISOString(),
        cohortStart: cohort.cohortStart.toISOString(),
        cohortEnd: cohort.cohortEnd.toISOString(),
        spotsRemaining: cohort.spotsRemaining,
        formatted: cohort.formatted
      };
      
    default:
      return {};
  }
}

// Export default instance
export const defaultDateGenerator = new DynamicDateGenerator();