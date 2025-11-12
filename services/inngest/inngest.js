import { Inngest } from "inngest";
import prismaClient from '../config/prisma.js'; // تأكد من .js هنا

export const inngest = new Inngest({
  id: "PGM",
  eventKey: process.env.INNGEST_EVENT_KEY, // مهم جداً للـ Production
  signingKey: process.env.INNGEST_SIGNING_KEY, // مهم جداً للـ Production
});

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation-from-clerk" }, // 🚨 تم التغيير ليكون فريد
  { name: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    try { // 🚨 أضف try/catch هنا
      await prismaClient.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0]?.email_address,
          name: (data?.first_name || '') + " " + (data?.last_name || ''),
          image: data?.image_url,
        },
      });
      return { success: true, message: "User created in DB" };
    } catch (error) {
      console.error("Error creating user in DB:", error);
      throw new Error("Failed to create user in DB");
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion-from-clerk" }, // 🚨 تم التغيير ليكون فريد
  { name: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    try { // 🚨 أضف try/catch هنا
      await prismaClient.user.delete({
        where: {
          id: data.id,
        },
      });
      return { success: true, message: "User deleted from DB" };
    } catch (error) {
      console.error("Error deleting user from DB:", error);
      throw new Error("Failed to delete user from DB");
    }
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update-from-clerk" }, // 🚨 تم التغيير ليكون فريد
  { name: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    try { // 🚨 أضف try/catch هنا
      await prismaClient.user.update({
        where: {
          id: data.id,
        },
        data: {
          email: data.email_addresses[0]?.email_address,
          name: (data?.first_name || '') + " " + (data?.last_name || ''),
          image: data?.image_url,
        },
      });
      return { success: true, message: "User updated in DB" };
    } catch (error) {
      console.error("Error updating user in DB:", error);
      throw new Error("Failed to update user in DB");
    }
  }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
