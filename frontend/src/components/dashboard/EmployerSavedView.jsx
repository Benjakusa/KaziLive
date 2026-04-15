import React from 'react';
import { Heart, MapPin, Star, MessageSquare } from 'lucide-react';

const EmployerSavedView = () => {
    const savedTalents = [
        { id: 1, name: 'Amina Ochieng', role: 'Full Stack Engineer', location: 'Nairobi', rating: 4.9, skills: ['React', 'Node.js', 'PostgreSQL'] },
        { id: 2, name: 'David Mwangi', role: 'Lead UX Designer', location: 'Kisumu', rating: 4.8, skills: ['Figma', 'User Research', 'Prototyping'] },
    ];

    return (
        <div className="dashboard-content-area">
            <div className="section-header-flex">
                <h2>Saved Profiles</h2>
                <div className="stats-pill">
                    <span>{savedTalents.length} Bookmarked</span>
                </div>
            </div>

            <div className="talents-grid mt-6">
                {savedTalents.map(talent => (
                    <div key={talent.id} className="talent-profile-card">
                        <div className="profile-header">
                            <div className="profile-avatar">{talent.name.charAt(0)}{talent.name.split(' ')[1]?.charAt(0)}</div>
                            <button className="btn-icon-maroon active"><Heart size={16} fill="white" /></button>
                        </div>
                        <div className="profile-body">
                            <h4>{talent.name}</h4>
                            <p className="profile-role">{talent.role}</p>
                            <div className="profile-details">
                                <span><MapPin size={14} /> {talent.location}</span>
                                <span><Star size={14} className="text-yellow" /> {talent.rating}</span>
                            </div>
                            <div className="profile-skills mt-2">
                                {talent.skills.map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                            <div className="profile-actions mt-4">
                                <button className="btn-outline-maroon btn-sm flex-1"><MessageSquare size={14} /> Message</button>
                                <button className="btn-maroon btn-sm flex-1">View Full</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployerSavedView;
