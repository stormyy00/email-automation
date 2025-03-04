"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileInput from "./profile-input";

const Profile = () => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [team, setTeam] = useState("");
  const [organization, setOrganization] = useState("");

  const [isEditingTeam, setIsEditingTeam] = useState(true);
  const [isSubmittedTeam, setIsSubmittedTeam] = useState(false);

  const [isEditingOrg, setIsEditingOrg] = useState(true);
  const [isSubmittedOrg, setIsSubmittedOrg] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          setUser(data?.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase.auth]);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-900">
        Profile
      </h2>

      <Card className="shadow-lg border border-gray-200 rounded-xl mt-4">
        <CardContent className="p-6 flex flex-col items-center gap-5">
          {loading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <Avatar className="w-20 h-20 border border-gray-300">
              <AvatarImage
                src={user?.user_metadata?.avatar_url || ""}
                alt="Profile picture"
              />
              <AvatarFallback className="text-gray-500 bg-gray-100">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="text-center">
            {loading ? (
              <Skeleton className="h-6 w-32 mb-2" />
            ) : (
              <p className="text-lg font-medium text-gray-900">
                {user?.user_metadata?.full_name || "Unknown User"}
              </p>
            )}
            {loading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <p className="text-gray-600 text-sm">
                {user?.email || "No email available"}
              </p>
            )}
          </div>
          <ProfileInput
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Enter Organization"
            isEditing={isEditingOrg}
            isSubmitted={isSubmittedOrg}
            setIsEditing={setIsEditingOrg}
            setIsSubmitted={setIsSubmittedOrg}
          />
          <ProfileInput
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Enter Team"
            isEditing={isEditingTeam}
            isSubmitted={isSubmittedTeam}
            setIsEditing={setIsEditingTeam}
            setIsSubmitted={setIsSubmittedTeam}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
