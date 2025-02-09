const Job = require('../models/Job');

/**
 * Create a new job listing.
 * @param {object} jobData - The job data.
 * @returns {Promise<Job>}
 */
exports.createJob = async (jobData) => {
  const job = new Job(jobData);
  await job.save();
  return job;
};

/**
 * Get all job listings.
 * @returns {Promise<Job[]>}
 */
exports.getAllJobs = async () => {
  return await Job.find({}).populate('category');
};

/**
 * Get a job listing by its ID.
 * @param {string} jobId
 * @returns {Promise<Job>}
 * @throws {Error} if job is not found
 */
exports.getJobById = async (jobId) => {
  const job = await Job.findById(jobId).populate('category');
  if (!job) {
    throw new Error('Job not found');
  }
  return job;
};

/**
 * Update a job listing by its ID.
 * @param {string} jobId
 * @param {object} updates - Fields to update.
 * @returns {Promise<Job>}
 * @throws {Error} if job is not found
 */
exports.updateJob = async (jobId, updates) => {
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('category');

  if (!updatedJob) {
    throw new Error('Job not found');
  }
  return updatedJob;
};

/**
 * Delete a job listing by its ID.
 * @param {string} jobId
 * @returns {Promise<Job>}
 * @throws {Error} if job is not found
 */
exports.deleteJob = async (jobId) => {
  const deletedJob = await Job.findByIdAndDelete(jobId);
  if (!deletedJob) {
    throw new Error('Job not found');
  }
  return deletedJob;
};
