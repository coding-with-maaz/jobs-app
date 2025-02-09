const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
  } = require('../services/jobService');
  
  /**
   * Create a new job listing.
   */
  exports.createJob = async (req, res) => {
    try {
      const jobData = req.body;
      const job = await createJob(jobData);
      return res.status(201).json({
        message: 'Job created successfully',
        job,
      });
    } catch (error) {
      console.error('Error creating job:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Get all job listings.
   */
  exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await getAllJobs();
      return res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Get a single job listing by ID.
   */
  exports.getJobById = async (req, res) => {
    try {
      const { id } = req.params;
      const job = await getJobById(id);
      return res.status(200).json({ job });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error fetching job:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Update a job listing by ID.
   */
  exports.updateJob = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const job = await updateJob(id, updates);
      return res.status(200).json({
        message: 'Job updated successfully',
        job,
      });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error updating job:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  
  /**
   * Delete a job listing by ID.
   */
  exports.deleteJob = async (req, res) => {
    try {
      const { id } = req.params;
      const job = await deleteJob(id);
      return res.status(200).json({
        message: 'Job deleted successfully',
        job,
      });
    } catch (error) {
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      console.error('Error deleting job:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  