import React, { useContext } from "react";
import clsx from "clsx";
import firebase from "firebase/app";
import "firebase/storage";
import { VersionContext } from "../../contexts/Version";
import { UserContext } from "../../contexts/AuthContext";
import Unchecked from "../../assets/icon-uncheck-pink.png";
import Checked from "../../assets/icon-check-pink.png";
import Delete from "../../assets/icon-delete.png";
import "./noteArea.css";

const NoteArea = ({
  pins,
  setPins,
  showAllPins,
  setShowAllPins,
  selectedPin,
  setSelectedPin
}) => {
  const versionContext = useContext(VersionContext);
  const db = firebase.firestore();
  let projectID;
  if (location.search.length == 21) {
    projectID = location.search.slice(1);
  }
  const userContext = useContext(UserContext);
  const creator = userContext.userInfo.displayName;
  const creatorPicture = userContext.userInfo.photoURL;

  const findPinIndex = checkValue => {
    let pinIndex;
    for (let i = 0; i < pins.length; i++) {
      if (pins[i]["createdTime"] === checkValue) {
        pinIndex = i;
      }
    }
    return pinIndex;
  };

  const saveToDB = newPins => {
    const dbLinkForPins = db.collection("projectPins").doc(projectID);
    dbLinkForPins
      .set({ pins: newPins }, { merge: true })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  const handleNote = e => {
    e.preventDefault();
    const checkValue = Number(e.currentTarget.key.value);
    let pinIndex = findPinIndex(checkValue);
    

    if (pins[pinIndex].notes == undefined) {
      const newPin = {
        ...pins[pinIndex],
        notes: [
          {
            creator,
            creatorPicture,
            note: e.currentTarget.opinion.value,
            writtenTime: Date.now()
          }
        ]
      };
      const newPins = Array.from(pins);
      newPins.splice(pinIndex, 1, newPin);
      setPins(newPins);
      saveToDB(newPins);
    } else {
      const newPins = Array.from(pins);
      const newPin = newPins[pinIndex];
      newPin.notes.push({
        creator,
        creatorPicture,
        note: e.currentTarget.opinion.value,
        writtenTime: Date.now()
      });
      newPins.splice(pinIndex, 1, newPin);
      setPins(newPins);
      saveToDB(newPins);
    }
    e.currentTarget.reset();
  };

  const handleCheck = checkValue => {
    let pinIndex = findPinIndex(checkValue);
    const newPins = Array.from(pins);
    const newPin = {
      ...pins[pinIndex],
      checked: !pins[pinIndex].checked
    };
    newPins.splice(pinIndex, 1, newPin);
    setPins(newPins);
    saveToDB(newPins);
  };

  const deleteNote = checkValue => {
    let pinIndex = findPinIndex(checkValue);
    const newPins = Array.from(pins);
    newPins.splice(pinIndex, 1);
    setPins(newPins);
    saveToDB(newPins);
  };

  const handlePinClick = (pinId) => () => {
    if (selectedPin === pinId) {
      setSelectedPin('');
    } else {
      setSelectedPin(pinId);
    }
  }

  let allNotes;
  if (versionContext) {
    const filteredPins = pins.filter(pin => {
      return pin.version == versionContext.showVersion;
    });
    if (filteredPins.length != 0) {
      const eachInput = filteredPins.map(filteredPin => (
        <div
          className={clsx("each-note", {
            selected: selectedPin === filteredPin.createdTime
          })}
          key={filteredPin.createdTime}
          
        >
          <div className="note-instruction" onClick={handlePinClick(filteredPin.createdTime)}>
            {filteredPin.checked ? (
              <div className="note-check-status">
                <img
                  className="note-check"
                  src={Checked}
                  onClick={handleCheck.bind(
                    handleCheck,
                    filteredPin.createdTime
                  )}
                />
                <div className="note-check-text">Solved</div>
              </div>
            ) : (
              <div className="note-check-status">
                <img
                  className="note-uncheck"
                  src={Unchecked}
                  onClick={handleCheck.bind(
                    handleCheck,
                    filteredPin.createdTime
                  )}
                />
                <div className="note-uncheck-text">Unsolved</div>
              </div>
            )}

            <img
              className="note-delete"
              src={Delete}
              onClick={deleteNote.bind(deleteNote, filteredPin.createdTime)}
            />
          </div>
          <div className="note-content">
            {filteredPin.notes
              ? filteredPin.notes.map(note => (
                  <div className="each-context" key={note.writtenTime}>
                    <div className="note-writer">
                      <img
                        src={note.creatorPicture}
                        className="note-writer-picture"
                      />
                      <div className="note-writer-name">{note.creator}</div>
                    </div>
                    <div className="note-context">{note.note}</div>
                  </div>
                ))
              : null}
          </div>

          <form onSubmit={handleNote} className="note-form">
            <input type="hidden" name="key" value={filteredPin.createdTime} />
            <textarea
              type="text"
              name="opinion"
              className="note-input"
              placeholder="Leave your message here..."
            />
            <button type="submit" className="note-submit">
              Comment
            </button>
          </form>
        </div>
      ));

      allNotes = <>{eachInput}</>;
    }
  }

  return (
    <>
      <div className={`note-for-pin ${!showAllPins.isAllPinsShown && "hide"}`}>
        {allNotes}
      </div>
    </>
  );
};

export default NoteArea;
