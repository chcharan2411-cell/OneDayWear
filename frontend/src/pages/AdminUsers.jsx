import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

import { getAdminUsers } from "../services/adminUserService";

import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin users error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const roles = useMemo(() => {
    const uniqueRoles = [
      ...new Set(
        users
          .map((user) => user.role)
          .filter(Boolean)
      ),
    ];

    return uniqueRoles;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const id = String(
        user.id ?? ""
      ).toLowerCase();

      const name = String(
        user.name ??
          user.username ??
          user.fullName ??
          ""
      ).toLowerCase();

      const email = String(
        user.email ?? ""
      ).toLowerCase();

      const role = String(
        user.role ?? ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        id.includes(search) ||
        name.includes(search) ||
        email.includes(search) ||
        role.includes(search);

      const matchesRole =
        roleFilter === "ALL" ||
        String(user.role) === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
  ]);

  const getUserName = (user) => {
    return (
      user.name ||
      user.username ||
      user.fullName ||
      "-"
    );
  };

  const getUserEmail = (user) => {
    return user.email || "-";
  };

  const getUserRole = (user) => {
    return user.role || "USER";
  };

  const getStatus = (user) => {
    if (
      user.enabled === false ||
      user.active === false
    ) {
      return "INACTIVE";
    }

    return "ACTIVE";
  };

  if (loading) {
    return (
      <main className="admin-users-page">
        <div className="admin-users-loading">
          <RefreshCw
            size={28}
            className="users-loading-spin"
          />

          <p>LOADING USERS...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-users-page">
        <div className="admin-users-error">

          <Users size={38} />

          <h2>
            USERS UNAVAILABLE
          </h2>

          <p>{error}</p>

          <button onClick={loadUsers}>
            <RefreshCw size={16} />
            RETRY
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="admin-users-page">

      {/* HEADER */}

      <section className="admin-users-header">

        <div>

          <div className="users-breadcrumb">
            ONEDAYWEAR / ADMIN
          </div>

          <h1>USERS</h1>

          <p>
            Manage registered customers
            and administrator accounts.
          </p>

        </div>

        <button
          className="users-refresh-button"
          onClick={loadUsers}
        >
          <RefreshCw size={17} />
          REFRESH
        </button>

      </section>


      {/* STATS */}

      <section className="admin-user-stats">

        <div className="admin-user-stat">

          <div className="user-stat-top">
            <span>
              TOTAL USERS
            </span>

            <Users
              size={20}
              strokeWidth={1.5}
            />
          </div>

          <strong>
            {users.length}
          </strong>

        </div>


        <div className="admin-user-stat">

          <div className="user-stat-top">
            <span>
              ADMINISTRATORS
            </span>

            <ShieldCheck
              size={20}
              strokeWidth={1.5}
            />
          </div>

          <strong>
            {
              users.filter(
                (user) =>
                  String(
                    user.role
                  ).toUpperCase() ===
                  "ADMIN"
              ).length
            }
          </strong>

        </div>


        <div className="admin-user-stat">

          <div className="user-stat-top">
            <span>
              VISIBLE USERS
            </span>

            <Users
              size={20}
              strokeWidth={1.5}
            />
          </div>

          <strong>
            {filteredUsers.length}
          </strong>

        </div>

      </section>


      {/* TOOLBAR */}

      <section className="admin-user-toolbar">

        <div className="admin-user-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="SEARCH USER, EMAIL OR ROLE..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>


        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            ALL ROLES
          </option>

          {roles.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}

        </select>

      </section>


      {/* TABLE */}

      <section className="admin-users-table-wrapper">

        <table className="admin-users-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="admin-users-empty"
                >
                  NO USERS FOUND
                </td>
              </tr>

            ) : (

              filteredUsers.map(
                (user, index) => (

                  <tr
                    key={
                      user.id ??
                      user.email ??
                      index
                    }
                  >

                    <td>
                      <strong>
                        #{user.id ?? index + 1}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {getUserName(user)}
                      </strong>
                    </td>

                    <td>
                      {getUserEmail(user)}
                    </td>

                    <td>

                      <span
                        className={`user-role user-role-${String(
                          getUserRole(user)
                        ).toLowerCase()}`}
                      >
                        {getUserRole(user)}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`user-status user-status-${getStatus(
                          user
                        ).toLowerCase()}`}
                      >
                        {getStatus(user)}
                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </section>

    </main>
  );
}

export default AdminUsers;