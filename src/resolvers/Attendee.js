async function user(root, args, context) {
  return context.prisma.attendee({ id: root.id }).user();
}

async function event(root, args, context) {
  return context.prisma.attendee({ id: root.id }).event();
}

module.exports = {
  event,
  user
};
