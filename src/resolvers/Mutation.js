const newUser = (root, args, context) => {
  const { firstName, lastName, email, birthday, gender, hobbies } = args;
  // We use Prisma built-in CRUD function "createUser" to create a new User with the values we detructured from the args
  return context.prisma.createUser({ firstName, lastName, email, birthday, gender, hobbies });
};

const deleteUser = async (root, { id }, context) => {
  const user = await context.prisma.user({ id: id });
  if (!user) {
    throw new Error("User not found in the database");
  }
  return context.prisma.deleteUser({ id: id });
};

const newEvent = (root, args, context) => {
  const { title, description, date, location } = args;
  return context.prisma.createEvent({ title, description, date, location });
};

const addAttendee = async (root, { eventID, userID }, context) => {
  try {
    // We verify that both the eventID and the userID exist in the db
    const user = await context.prisma.user({ id: userID });
    if (!user) {
      throw new Error("User not found in the database");
    }
    const event = await context.prisma.event({ id: eventID });
    if (!event) {
      throw new Error("Event does not exist in the database");
    }
    // Since attendees are unique (one user can only register once for an event)
    // We check wether or not the relation already exists
    const isAlreadyAttending = await context.prisma.$exists.attendee({
      user: { id: userID },
      event: { id: eventID }
    });
    if (isAlreadyAttending) {
      throw new Error(`User (${userID}) is already attending the event: ${eventID}`);
    }

    return context.prisma.createAttendee({
      // We tell Prisma how to connect the joint table Attendee
      user: { connect: { id: userID } },
      event: { connect: { id: eventID } }
    });
  } catch (error) {
    console.log("Error intercepted by the catch : ", error);
  }
};

const deleteAttendee = async (root, { eventID, userID }, context) => {
  try {
    const user = await context.prisma.user({ id: userID });
    if (!user) {
      throw new Error("User not found in the database");
    }
    const event = await context.prisma.event({ id: eventID });
    if (!event) {
      throw new Error("Event does not exist in the database");
    }
    // We search for the attendee where User = user and Event= Event
    // But this query doesn't work : apparently i'm not giving the right type of input
    // It only accepts an input of unique type, therefore the ID! of attendee
    // but that's precisely this ID I'm trying to get by doing this..
    const attendee = await context.prisma.attendee({
      user: user,
      event: event
    });
    if (!attendee) {
      throw new Error(
        `The attendance (${attendee.id}) cannot be find in the database. It may have been already deleted`
      );
    }
    // We delete the attendee by the id we (should have) got before
    return context.prisma.deleteAttendee({ id: attendee.id });
  } catch (error) {
    console.log("Error intercepted by the catch:", error);
  }
};

module.exports = {
  newUser,
  deleteUser,
  newEvent,
  addAttendee,
  deleteAttendee
};
