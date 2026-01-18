const MembershipPlan = require("../models/MembershipPlan");

// Create Membership Plan
exports.createPlan = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'price', 'duration', 'maxGyms', 'maxStaff', 'maxMembers'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Add createdBy from authenticated user
    const planData = {
      ...req.body,
      createdBy: req.user.id,
      termsAccepted: true // Since user accepts terms in frontend
    };

    // Create plan
    const plan = await MembershipPlan.create(planData);

    // Calculate total price and duration in days
    const planWithVirtuals = {
      ...plan.toObject(),
      totalPrice: plan.totalPrice,
      durationInDays: plan.durationInDays
    };

    res.status(201).json({ 
      success: true,
      message: "Membership plan created successfully", 
      plan: planWithVirtuals 
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "Plan with this name already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Get All Plans with filters and pagination
exports.getAllPlans = async (req, res) => {
  try {
    const { 
      status, 
      planType, 
      minPrice, 
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by plan type
    if (planType) {
      query.planType = planType;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count
    const total = await MembershipPlan.countDocuments(query);
    
    // Get plans with pagination
    const plans = await MembershipPlan.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .lean(); // Convert to plain objects to add virtuals

    // Add virtual fields to each plan
    const plansWithVirtuals = plans.map(plan => ({
      ...plan,
      totalPrice: plan.price + plan.setupFee,
      durationInDays: plan.duration * (plan.durationUnit === 'days' ? 1 : 
                       plan.durationUnit === 'months' ? 30 : 365)
    }));

    res.json({ 
      success: true, 
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      plans: plansWithVirtuals 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Get Single Plan
exports.getPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await MembershipPlan.findById(planId)
      .populate('createdBy', 'name email');
    
    if (!plan) {
      return res.status(404).json({ 
        success: false,
        message: "Plan not found" 
      });
    }

    // Add virtual fields
    const planWithVirtuals = {
      ...plan.toObject(),
      totalPrice: plan.totalPrice,
      durationInDays: plan.durationInDays
    };

    res.json({ 
      success: true, 
      plan: planWithVirtuals 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    // Find and update
    const plan = await MembershipPlan.findByIdAndUpdate(
      planId, 
      req.body, 
      { 
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    ).populate('createdBy', 'name email');
    
    if (!plan) {
      return res.status(404).json({ 
        success: false,
        message: "Plan not found" 
      });
    }

    // Add virtual fields
    const planWithVirtuals = {
      ...plan.toObject(),
      totalPrice: plan.totalPrice,
      durationInDays: plan.durationInDays
    };

    res.json({ 
      success: true,
      message: "Plan updated successfully", 
      plan: planWithVirtuals 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await MembershipPlan.findByIdAndDelete(planId);
    
    if (!plan) {
      return res.status(404).json({ 
        success: false,
        message: "Plan not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Plan deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Toggle Plan Status
exports.togglePlanStatus = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const plan = await MembershipPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ 
        success: false,
        message: "Plan not found" 
      });
    }

    // Toggle status
    plan.status = plan.status === 'active' ? 'inactive' : 'active';
    await plan.save();

    res.json({ 
      success: true,
      message: `Plan ${plan.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      plan 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};