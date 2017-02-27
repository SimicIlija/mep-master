'use strict';
/** @namespace strategy */

const TAG = 'Scheduler';

/**
 * Default scheduler class describes general task scheduling and robot behaviour
 * @memberOf strategy
 * @example
 * class MyScheduler extends Scheduler {
 *  constructor() {
 *      this.tasks = [
 *          new InitTask(this, 10000, 10, 1)
 *      ];
 *  }
 *  runNextTask() {
 *      // Here you can override default scheduler
 *  }
 * }
 */
class Scheduler {
    constructor() {
        this.tasks = [];

        process.on('unhandledRejection', this.onUnhandledTaskError.bind(this));
    }

    /**
     * Run default action if there is the exception in task is not caught with `try {} catch(e) {}`.
     * @param {TaskError} reason - Describes more about an exception
     */
    onUnhandledTaskError(reason) {
        if (reason !== undefined && reason.constructor !== undefined) {
            if (reason.constructor.name === 'TaskError') {
                Mep.Log.warn(TAG, reason);
                this.runNextTask();
            }
        } else {
            throw Error(reason);
        }
    }

    /**
     * Get all registered task
     * @returns {Array} Array of tasks type Task
     */
    getTasks() {
        return this.tasks;
    }

    runNextTask() {
        let nextTask = Mep.Scheduler.recommendNextTask(this.tasks);
        if (nextTask !== null) {
            this.runTask(nextTask);
        } else {
            Mep.Log.info(TAG, 'No more tasks');
        }
    }

    runTask(task) {
        task.run();
    }
}

module.exports = Scheduler;