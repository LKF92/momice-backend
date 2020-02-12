function attendees(root, args, context) {
  return context.prisma.event({ id: root.id }).attendees();
}

module.exports = { attendees };
