import moment from "moment";

class MinuteCounter {
    constructor(beginDate, finishDate) {
        this.data = [];
        this.now = moment();
        this.beginDate = beginDate;
        this.finishDate = finishDate;
    }

    addOrSetToKey(key, startDate, endDate) {
        if ((!this.beginDate && !this.finishDate) || (this.beginDate && this.finishDate && startDate.isAfter(this.beginDate) && endDate.isBefore(this.finishDate))) {
            let index = -1;
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i].key === key) {
                    index = i;
                    break;
                }
            }

            const total = ((endDate - startDate) / 1000 / 60);
            let spent = 0;
            if (endDate.isBefore(this.now)) {
                spent = total;
            } else if (this.now.isBetween(startDate, endDate)) {
                spent = ((this.now - startDate) / 1000 / 60);
            }

            if (index !== -1) {
                this.data[index].total += total;
                this.data[index].spent += spent;
            } else {
                this.data.push({ key: key, spent: spent, total: total });
            }
        }
    }

    sort() {
        if (this.data.length > 1) {
            for (let i = 0; i < this.data.length; i++) {
                for (let j = 0; j < this.data.length; j++) {
                    if (this.data[i].total > this.data[j].total) {
                        const temp = this.data[i];
                        this.data[i] = this.data[j];
                        this.data[j] = temp;
                    }
                }
            }
        }
    }

    toObject() {
        this.sort();
        return this.data;
    }
}

const minutesBySubjects = (events, beginDate, finishDate) => {
    const result = new MinuteCounter(beginDate, finishDate);

    for (const event of events) {
        result.addOrSetToKey(event.name, moment(event.start), moment(event.end));
    }

    return result.toObject();
}

const minutesByType = (events, beginDate, finishDate) => {
    const result = new MinuteCounter(beginDate, finishDate);

    for (const event of events) {
        result.addOrSetToKey(event.type, moment(event.start), moment(event.end));
    }

    return result.toObject();
}

const minutesByTeachers = (events, beginDate, finishDate) => {
    const result = new MinuteCounter(beginDate, finishDate);

    for (const event of events) {
        result.addOrSetToKey(event.teacher, moment(event.start), moment(event.end));
    }

    return result.toObject();
}

const minutesByLocations = (events, beginDate, finishDate) => {
    const result = new MinuteCounter(beginDate, finishDate);

    for (const event of events) {
        result.addOrSetToKey(event.location, moment(event.start), moment(event.end));
    }

    return result.toObject();
}

const totalAndSpentMinutes = (events, beginDate, finishDate) => {
    let totalMinutes = 0;
    let spentMinutes = 0;
    for (const event of events) {
        const startDate = moment(event.start);
        const endDate = moment(event.end);
        if ((!beginDate && !finishDate) || (beginDate && finishDate && startDate.isAfter(beginDate) && endDate.isBefore(finishDate))) {
            const now = moment();

            const classDuration = ((endDate - startDate) / 60 / 1000);
            totalMinutes += classDuration;

            if (endDate < now) {
                spentMinutes += classDuration;
            } else if (startDate < now && now < endDate) {
                spentMinutes += ((now - startDate) / 60 / 1000);
            }
        }
    }
    return { spent: spentMinutes, total: totalMinutes };
}

const percentageCompleted = (spent, total) => {
    if (total === 0) return 100;
    const percentage = spent * 100 / total;

    return +(Math.round(percentage + "e+2") + "e-2");
}

const numberOfClassAfter = (events, limitHour) => {
    let count = 0;
    for (const event of events) {
        const limitDate = moment(event.end);
        limitDate.hours(limitHour.hours());
        limitDate.minutes(limitHour.minutes());

        if (limitDate.isBefore(moment(event.end))) count++
    }
    return count;
};

const getStats = (events, beginDate, finishDate) => {
    const { total, spent } = totalAndSpentMinutes(events, beginDate, finishDate);

    return {
        percentage: percentageCompleted(spent, total),
        minTotal: total,
        minSpent: spent,
        minBySubjects: minutesBySubjects(events, beginDate, finishDate),
        minByType: minutesByType(events, beginDate, finishDate),
        minByTeachers: minutesByTeachers(events, beginDate, finishDate),
        minByLocations: minutesByLocations(events, beginDate, finishDate),
    }
}

const minToStrHours = (min) => {
    const hours = Math.floor(min / 60);
    const minutes = Math.floor(min % 60);
    if (hours > 0) {
        if (minutes > 0) return hours + "h" + minutes;
        return hours + "h";
    }
    return minutes;
}

export {
    getStats,
    minToStrHours,
    numberOfClassAfter
};
