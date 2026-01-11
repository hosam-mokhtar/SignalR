using Microsoft.AspNetCore.Mvc;

namespace SignalRDemo.Controllers
{
    public class ChatController : Controller
    {
        public IActionResult Index()
        {
            return View(); 
        }
    }

}
