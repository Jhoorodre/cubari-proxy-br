import React, { useState, useEffect, useRef, memo } from "react";
import observer from "../utils/observer";
import { HeartIcon, XIcon } from "@heroicons/react/solid";
import { classNames } from "../utils/strings";
import { globalHistoryHandler } from "../utils/remotestorage";
import { mangaUrlSaver } from "../utils/compatability";
import { SpinIcon } from "./Spinner";
import Card from "./Card";
import { convertImageUrl, resizedImageUrl } from "../sources/SourceUtils";
import { useTranslation } from "react-i18next";

function MangaCard(props) {
  const { t } = useTranslation();
  const cardRef = useRef(null);

  const [saved, setSaved] = useState(props.saved !== undefined ? props.saved : undefined);
  const [saving, setSaving] = useState(props.saved === undefined);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    if (props.saved === undefined) {
      globalHistoryHandler
        .isSeriesPinned(props.slug, props.sourceName)
        .then((isPinned) => {
          if (cardRef.current) {
            setSaved(isPinned);
            setSaving(false);
          }
        });
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, [props.slug, props.sourceName, props.saved]);

  const consolidateStateAfterEffect = (newSaved, newSavingState, newRemovingState) => {
    if (cardRef.current) {
      if (newSaved !== undefined) setSaved(newSaved);
      if (newSavingState !== undefined) setSaving(newSavingState);
      if (newRemovingState !== undefined) setRemoving(newRemovingState);
    }
  };

  const saveToHistoryInternal = () => {
    return globalHistoryHandler
      .pushSeries(
        props.slug,
        props.coverUrl,
        props.sourceName,
        mangaUrlSaver(props.mangaUrlizer(props.slug)),
        props.mangaTitle
      )
      .then(() => {
        if (props.storageCallback) {
          props.storageCallback().then(() => {
            consolidateStateAfterEffect(undefined, undefined, false);
          });
        } else {
          consolidateStateAfterEffect(undefined, undefined, false);
        }
      });
  };

  const removeFromHistoryInternal = () => {
    return globalHistoryHandler
      .removeSeries(props.slug, props.sourceName)
      .then(() => {
        if (props.storageCallback) {
          props.storageCallback().then(() => {
            consolidateStateAfterEffect(undefined, undefined, false);
          });
        } else {
          consolidateStateAfterEffect(undefined, undefined, false);
        }
      });
  };

  const saveToPinInternal = () => {
    return globalHistoryHandler
      .pinSeries(
        props.slug,
        props.coverUrl,
        props.sourceName,
        mangaUrlSaver(props.mangaUrlizer(props.slug)),
        props.mangaTitle
      )
      .then(() => {
        if (props.storageCallback) {
          props.storageCallback().then(() => {
            consolidateStateAfterEffect(true, false, undefined);
          });
        } else {
          consolidateStateAfterEffect(true, false, undefined);
        }
      });
  };

  const removeFromPinInternal = () => {
    return globalHistoryHandler
      .unpinSeries(props.slug, props.sourceName)
      .then(() => {
        if (props.storageCallback) {
          props.storageCallback().then(() => {
            consolidateStateAfterEffect(false, false, undefined);
          });
        } else {
          consolidateStateAfterEffect(false, false, undefined);
        }
      });
  };

  const addHistoryHandler = (e) => {
    setRemoving(true);
    saveToHistoryInternal();
  };

  const removeHistoryHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!removing) {
      setRemoving(true);
      removeFromHistoryInternal();
    }
    return false;
  };

  const pinHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!saving) {
      setSaving(true);
      if (!saved) {
        saveToPinInternal();
      } else {
        removeFromPinInternal();
      }
    }
    return false;
  };

  return (
    <Card>
      <a
        ref={cardRef}
        href={props.mangaUrlizer(props.slug)}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(
          "relative bg-no-repeat bg-cover bg-center bg-gray-300 dark:bg-gray-800",
          "transform rounded-lg shadow-md scale-100 md:hover:scale-105",
          "flex flex-col justify-between duration-100 ease-in-out",
          "w-full h-full"
        )}
        data-background-image={`linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.75) 100%), url("${resizedImageUrl(
          convertImageUrl(props.coverUrl, props.sourceName),
          "w=300"
        )}")`}
        onClick={addHistoryHandler}
      >
        {/* Container do Topo: Nome da Fonte e Botões */}
        <div className="flex justify-between items-center w-full p-2 z-10">
          <p 
            className="text-xs md:text-sm text-white font-bold"
            style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }} // Contorno preto nítido
          >
            {props.sourceName}
          </p>
          <div className="flex flex-row">
            {props.showRemoveButton && (
              <button
                title={t('tooltipRemoveFromHistory')}
                className="p-1 text-white transition-colors duration-150 rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 opacity-70 hover:opacity-100"
                onClick={removeHistoryHandler}
              >
                {removing ? (
                  <SpinIcon className="w-5 h-5" />
                ) : (
                  <XIcon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              title={saved ? t('tooltipRemoveFromFavorites') : t('tooltipAddToFavorites')}
              className={classNames(
                "p-1 text-white transition-colors duration-150 rounded-full focus:outline-none focus:ring-2 opacity-70 hover:opacity-100",
                saved
                  ? "text-red-500 hover:bg-red-200 focus:ring-red-500"
                  : "hover:bg-gray-500 focus:ring-gray-500"
              )}
              onClick={pinHandler}
            >
              {saving ? (
                <SpinIcon className="w-5 h-5" />
              ) : (
                <HeartIcon
                  className={classNames(
                    "w-5 h-5",
                    saved ? "fill-current" : ""
                  )}
                />
              )}
            </button>
          </div>
        </div>

        {/* Container do Rodapé: Título do Mangá */}
        <div className="w-full p-2 z-10">
          <h3 
            className="text-sm sm:text-base text-white font-bold"
            style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }} // Contorno preto nítido
          >
            {props.mangaTitle}
          </h3>
        </div>
      </a>
    </Card>
  );
}

export default memo(MangaCard);
