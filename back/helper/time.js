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

    console.log('Input pubDate:', pubDate);

    if (!pubDate) {
        return ['', 'Không xác định'];
    }

    try {
        // Remove GMT+7 from the string and parse
        const dateStr = pubDate.replace(' GMT+7', '');
        const pubDateObj = new Date(dateStr);
        console.log('Parsed pubDate object:', pubDateObj);
        
        if (isNaN(pubDateObj.getTime())) {
            console.log('Invalid date detected');
            return ['', 'Không xác định'];
        }

        // Get current time
        const now = new Date();
        
        const timeDiff = now - pubDateObj;
        console.log('Time difference in ms:', timeDiff);
        
        // Nếu thời gian trong tương lai, hiển thị ngày tháng
        if (timeDiff < 0) {
            const result = pubDateObj.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return ['', result];
        }

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        let timeString;
        
        if (hours >= 24) {
            // Nếu quá 24h, hiển thị ngày tháng năm
            timeString = pubDateObj.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else if (hours > 0) {
            timeString = `${hours} giờ trước`;
        } else if (minutes > 0) {
            timeString = `${minutes} phút trước`;
        } else if (seconds >= 0) {
            timeString = `${seconds} giây trước`;
        } else {
            timeString = 'Vừa xong';
        }

        console.log('Final time string:', timeString);
        return ['', timeString];
    } catch (error) {
        console.error('Error formatting time:', error);
        return ['', 'Không xác định'];
    }
}

export {formatTimeDifferenceWithCustomTZToGMT7}