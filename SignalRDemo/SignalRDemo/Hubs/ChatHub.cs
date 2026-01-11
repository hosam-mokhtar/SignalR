using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Context;
using SignalRDemo.Models;

namespace SignalRDemo.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatDbContext _context;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ChatDbContext context, ILogger<ChatHub> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task Send(string userName, string message)
        {
            await Clients.Others.SendAsync("ReciveMessage", userName, message);

            var msg = new Message
            {
                UserName = userName,
                Text = message
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();
        }

        public async Task JoinGroup(string groupName, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Notify ONLY other members in the group (exclude the user who just joined)
            await Clients.OthersInGroup(groupName).SendAsync("NewMemberJoin", userName, groupName);

            _logger.LogInformation(Context.ConnectionId);
        }

        public async Task SendToGroup(string groupName, string sender, string groupMessage)
        {
            await Clients.OthersInGroup(groupName).SendAsync("ReciveMessageFromGroup", sender, groupMessage);

            var msg = new Message
            {
                UserName = sender,
                Text = groupMessage
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();
        }
    }
}
