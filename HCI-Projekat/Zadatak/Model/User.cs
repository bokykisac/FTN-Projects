using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zadatak.Model
{
    public class User
    {

        private string username;
        private string password;
        private string email;

        public User(string username, string password, string email)
        {
            this.username = username;
            this.password = password;
            this.email = email;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Email { get => email; set => email = value; }
    }
}
