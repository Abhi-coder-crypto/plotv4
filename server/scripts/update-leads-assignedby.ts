import mongoose from "mongoose";
import { LeadModel } from "../models";
import { UserModel } from "../models";

async function updateLeadsAssignedBy() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/plot-crm";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Get the first admin user as default
    const adminUser = await UserModel.findOne({ role: "admin" });
    
    if (!adminUser) {
      console.log("No admin user found!");
      process.exit(1);
    }

    console.log(`Using admin user: ${adminUser.name} (${adminUser._id})`);

    // Find all leads without assignedBy field
    const leadsWithoutAssignedBy = await LeadModel.find({
      assignedBy: { $exists: false }
    });

    console.log(`Found ${leadsWithoutAssignedBy.length} leads without assignedBy field`);

    // Update each lead
    for (const lead of leadsWithoutAssignedBy) {
      // If lead has assignedTo, use that person as assignedBy, otherwise use admin
      const assignedById = lead.assignedTo || adminUser._id;
      
      await LeadModel.updateOne(
        { _id: lead._id },
        { $set: { assignedBy: assignedById } }
      );
      
      console.log(`Updated lead: ${lead.name} - assigned by: ${assignedById}`);
    }

    console.log("✓ All leads updated successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error updating leads:", error);
    process.exit(1);
  }
}

updateLeadsAssignedBy();
