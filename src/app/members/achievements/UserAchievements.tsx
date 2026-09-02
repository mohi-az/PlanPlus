"use client";
import { AchievementsContext } from "@/contexts/AchievementsContext";
import clsx from "clsx";
import React, { useContext } from "react";
import { FaRepeat } from "react-icons/fa6";

export default function UserAchievements() {
  const { userAchievements, isPending } = useContext(AchievementsContext);
  return (
    <div>
      {!isPending ? (
        <div className="overflow-x-auto ">
          <table className="table table-md">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold text-lg">
                <th>Name</th>
                <th>Description</th>
                <th>Point</th>
                <th>Eraned at</th>
              </tr>
            </thead>
            <tbody>
              {userAchievements.map((achievement) => (
                <tr
                  key={achievement.achievements.id}
                  className={clsx(
                    achievement.completeAt
                      ? "bg-gradient-to-r from-amber-200 to-yellow-500 text-black"
                      : "bg-gradient-to-r from-neutral-300 to-stone-400 text-black",
                  )}
                >
                  <td className="inline-flex gap-3">
                    {achievement.achievements.name}
                    {achievement.achievements.isRepeatable && (
                      <span
                        className="tooltip tooltip-top tooltip-right"
                        data-tip="This achievement can be earned multiple times."
                      >
                        <FaRepeat />
                      </span>
                    )}
                  </td>
                  <td>{achievement.achievements.description}</td>
                  <td>
                    {achievement.achievements.points}
                    {achievement.count > 1 &&
                      " X " + achievement.count + " times"}
                  </td>
                  <td>
                    {achievement.completeAt
                      ? new Date(achievement.completeAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
