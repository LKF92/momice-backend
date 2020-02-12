const allUsers = (root, args, context) => {
  return context.prisma.users();
};

const allEvents = (root, args, context) => {
  return context.prisma.events();
};

// Retrieve all attendees for a specific event
const allAttendees = async (root, { eventID }, context) => {
  try {
    const event = await context.prisma.event({ id: eventID });
    if (!event) {
      throw new Error("Event does not exist in the database");
    }
    const attendees = await context.prisma.event({ id: event.id }).attendees();

    return attendees;
  } catch (error) {
    console.log("Error intercepted by the catch:", error);
  }
};
module.exports = { allUsers, allEvents, allAttendees };
