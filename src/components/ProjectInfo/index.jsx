import React, { useContext } from "react";
import "firebase/storage";
import { ProjectContext } from "../../contexts/ProjectID";
import "./projectInfo.css";

const ProjectInfo = () => {
  const context = useContext(ProjectContext);

  let projectProfile;
  if (context.project !== null) {
    const projectFormat = context.project.data.format.toString();
    const referencesImages = context.project.data.referenceImages;
    const referenceEach = referencesImages.map(referencesImage => (
      <div className="profile-reference-each" key={referencesImage.downloadURL}>
        <div className="profile-reference-each-image-container">
          <img
            className="profile-reference-each-image"
            src={referencesImage.downloadURL}
          />
        </div>
        <div className="profile-reference-each-description">
          <div className="profile-reference-each-name">
            <b>{referencesImage.fileName}</b>
          </div>
          <div className="profile-reference-each-note">
            {referencesImage.note}
          </div>
        </div>
      </div>
    ));
    const referencesAll = <>{referenceEach}</>;

    projectProfile = (
      <>
       
          <div className="project-info-name project-info-item">
            <b>Project Name:</b>&nbsp;{context.project.data.name}
          </div>
          <div className="project-info-purpose project-info-item">
            <b>Project Purpose:</b>&nbsp;{context.project.data.purpose}
          </div>
          <div className="project-info-format project-info-item">
            <b>Project Format:</b>&nbsp;{projectFormat}
          </div>
          <div className="project-info-images project-info-item">
            <b>Project Reference Picture:</b>
          </div>
          <div className="profile-reference-images">
            {referencesAll}
          </div>
       
      </>
    );
  }

  return (
    <React.Fragment>
      
        <div className="project-information-details">{projectProfile}</div>
    
    </React.Fragment>
  );
};

export default ProjectInfo;
