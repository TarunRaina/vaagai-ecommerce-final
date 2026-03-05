import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const Profile = () => {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/profile/", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditMode(false);
    } catch (err) {
      console.error("Update failed");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>

      {!editMode ? (
        <div>
          {profile.profile_image && (
            <img src={profile.profile_image} width="120" />
          )}

          <p>
            <strong>Name:</strong> {profile.full_name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Mobile:</strong> {profile.mobile_number}
          </p>
          <p>
            <strong>Address:</strong> {profile.address}
          </p>

          <p>
            <strong>Account Type:</strong>
            {profile.is_business_account ? " Business" : " Individual"}
          </p>

          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Name</label>
            <input
              value={profile.full_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label>Mobile</label>
            <input
              value={profile.mobile_number || ""}
              onChange={(e) =>
                setProfile({ ...profile, mobile_number: e.target.value })
              }
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>

          <button type="submit">Save</button>

          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
