function formatTimeDifferenceWithCustomTZToGMT7(pubDate) {
    /**
     * Converts a given publication date and timezone to a human-readable time difference string,
     * converting the time to GMT+7 (Vietnam time).
     *
     * @param {string} pubDate The publication date and time in ISO 8601 format (e.g., "2025-02-23T03:46:00.000Z").
     * @param {string} pubDateTZ The timezone of the publication date (e.g., "UTC", "+03:00", "-05:00").
     * @returns {string} A string representing the time difference in a human-readable format.
     * e.g., "hh:mm:ss-dd-mm-yyyy 17 seconds ago", "hh:mm:ss-dd-mm-yyyy 20 minutes ago".
     */

    const pubDateObj = new Date(pubDate);
    const now = new Date();

    // // Parse pubDateTZ to get the offset in hours
    // let pubDateOffsetHours = 0;
    // if (pubDateTZ === "UTC" || pubDateTZ === "Z") {
    //     pubDateOffsetHours = 0;
    // } else {
    //     const sign = pubDateTZ[0] === "+" ? 1 : -1;
    //     const hours = parseInt(pubDateTZ.substring(1, 3));
    //     const minutes = parseInt(pubDateTZ.substring(4, 6));
    //     pubDateOffsetHours = sign * (hours + minutes / 60);
    // }

    // // Convert pubDate to GMT+7
    // const pubDateGMT7 = new Date(pubDateObj.getTime() + (0 - pubDateOffsetHours) * 60 * 60 * 1000);

    // Convert 'now' to GMT+7
    const nowGMT7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    const timeDiff = nowGMT7 - pubDateObj;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const pubDateStr = pubDateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }) + ' ' + pubDateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    let timediff
    if (seconds < 60) {
        timediff = `${seconds} giây trước`;
    } else if (minutes < 60) {
        timediff = `${minutes} minutes ago`;
    } else if (hours < 24) {
        timediff = `${hours} hours ago`;
    } else if (days < 7) {
        timediff = `${days} ngày trước`;
    } else if (weeks < 4) {
        timediff = `${weeks} weeks ago`;
    } else if (months < 12) {
        timediff = `${months} months ago`;
    } else {
        timediff = `${years} years ago`;
    }

    return [pubDateStr, timediff]
}

export {formatTimeDifferenceWithCustomTZToGMT7}