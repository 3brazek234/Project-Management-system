import { Inngest } from "inngest";
import prisma from "../config/prisma";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "PGM",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { name: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { name: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { name: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
