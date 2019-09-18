using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Zadatak.Model
{
    public class Users
    {

        private ObservableCollection<User> users;

        public ObservableCollection<User> UsersList
        {
            get { return this.users; }
            set { this.users = value; }
        }

    }
}
