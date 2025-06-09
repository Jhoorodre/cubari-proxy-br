import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  QuestionMarkCircleIcon, 
  XIcon, 
  CloudIcon, 
  ShieldCheckIcon, 
  CogIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  ExclamationIcon, // Alterado de ExclamationTriangleIcon
  InformationCircleIcon
} from '@heroicons/react/outline';
import { useTranslation, Trans } from 'react-i18next';

const RemoteStorageHelp = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="remote-storage-help-button group"
        aria-label={t('remoteStorageHelp.buttonTooltip')}
        title={t('remoteStorageHelp.buttonTooltip')}
      >
        <QuestionMarkCircleIcon className="h-8 w-8 text-white transition-transform duration-300 group-hover:rotate-12" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-1050 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/30 dark:bg-black/50" />
            </Transition.Child>

            {/* Modal panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-xl p-5 sm:p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg sm:text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 flex justify-between items-center pb-3 border-b dark:border-gray-700 mb-4"
                >
                  {t('remoteStorageHelp.modalTitle')}
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={t('remoteStorageHelp.closeButton')}
                  >
                    <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </Dialog.Title>
                
                <div className="mt-2 space-y-4 text-sm text-gray-700 dark:text-gray-300 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">

                  {/* Quick Start Section */}
                  <section className="p-3 sm:p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg shadow-sm">
                    <h4 className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300 flex items-center mb-1 sm:mb-2">
                      <InformationCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" />
                      {t('remoteStorageHelp.quickStart.title')}
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-200">{t('remoteStorageHelp.quickStart.description')}</p>
                  </section>

                  {/* What is 5apps Section */}
                  <section>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-1">
                      <CloudIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                      {t('remoteStorageHelp.whatIs.title')}
                    </h4>
                    <p className="text-xs sm:text-sm">{t('remoteStorageHelp.whatIs.content')}</p>
                  </section>

                  {/* Benefits Section */}
                  <section>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-1 sm:mb-2">
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                      {t('remoteStorageHelp.benefits.title')}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 pl-3 text-xs sm:text-sm">
                      <li>{t('remoteStorageHelp.benefits.item1')}</li>
                      <li>{t('remoteStorageHelp.benefits.item2')}</li>
                      <li>{t('remoteStorageHelp.benefits.item3')}</li>
                      <li>{t('remoteStorageHelp.benefits.item4')}</li>
                    </ul>
                  </section>

                  {/* How to Connect Section */}
                  <section>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-1 sm:mb-2">
                      <CogIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                      {t('remoteStorageHelp.howTo.title')}
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 pl-3 text-xs sm:text-sm">
                      <li><Trans i18nKey="remoteStorageHelp.howTo.step1">Vá em <span className="font-medium">Configurações</span> → <span className="font-medium">Armazenamento Remoto</span></Trans></li>
                      <li>{t('remoteStorageHelp.howTo.step2')}</li>
                      <li>{t('remoteStorageHelp.howTo.step3')}</li>
                    </ol>
                    <p className="mt-2 sm:mt-3 text-xs text-gray-600 dark:text-gray-400">
                      {t('remoteStorageHelp.howTo.noAccount')}{' '}
                      <a 
                        href="https://5apps.com/users/sign_up?site=storage" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline dark:text-blue-400 font-medium inline-flex items-center"
                      >
                        {t('remoteStorageHelp.howTo.createAccount')}
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </section>
                    {/* Cubari.moe Section */}
                  <section className="mt-4 sm:mt-5">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex flex-nowrap items-center mb-1 sm:mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="whitespace-nowrap mr-1">{t('remoteStorageHelp.cubariMoe.titlePrefix')}</span>
                      <a 
                        href="https://cubari.moe/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:underline dark:text-blue-400 font-medium whitespace-nowrap mr-1"
                      >
                        {t('remoteStorageHelp.cubariMoe.titleLinkText')}
                      </a>
                      <span className="whitespace-nowrap">{t('remoteStorageHelp.cubariMoe.titleSuffix')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm mb-2">
                      <Trans 
                        i18nKey="remoteStorageHelp.cubariMoe.intro"
                        components={{
                          0: <a href="https://cubari.moe/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-blue-400 font-medium" />
                        }}
                      />
                    </p>
                    <details className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-md">
                      <summary className="font-medium cursor-pointer hover:text-blue-600 dark:hover:text-blue-300">{t('remoteStorageHelp.cubariMoe.howToConnectTitle')}</summary>
                      <ol className="list-decimal list-inside space-y-1 pl-3 mt-2 text-gray-600 dark:text-gray-400">
                        <li>
                          <Trans 
                            i18nKey="remoteStorageHelp.cubariMoe.step1"
                            components={{
                              0: <a href="https://cubari.moe/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-blue-400 font-medium" />
                            }}
                          />
                        </li>
                        <li>
                          <Trans 
                            i18nKey="remoteStorageHelp.cubariMoe.step2"
                            components={{
                              0: <a href="https://cubari.moe/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-blue-400 font-medium" />
                            }}
                          />
                        </li>
                        <li>{t('remoteStorageHelp.cubariMoe.step3')}</li>
                        <li>
                          <Trans 
                            i18nKey="remoteStorageHelp.cubariMoe.step4"
                            components={{
                              0: <a href="https://cubari.moe/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-blue-400 font-medium" />
                            }}
                          />
                        </li>
                        <li>
                          <Trans 
                            i18nKey="remoteStorageHelp.cubariMoe.step5"
                            components={{
                              0: <a href="https://cubari.moe/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-blue-400 font-medium" />
                            }}
                          />
                        </li>
                      </ol>
                    </details>
                  </section>

                  {/* After Connecting Section (Moved After Cubari.moe) */}
                  <section>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-1 sm:mb-2">
                      <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                      {t('remoteStorageHelp.afterConnect.title')}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 pl-3 text-xs sm:text-sm">
                      <li>{t('remoteStorageHelp.afterConnect.item1')}</li>
                      <li>{t('remoteStorageHelp.afterConnect.item2')}</li>
                      <li>{t('remoteStorageHelp.afterConnect.item3')}</li>
                    </ul>
                  </section>

                  {/* Aviso Importante sobre conexão por dispositivo */}
                  <section className="mt-4 sm:mt-5 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-700/30 rounded-lg border border-yellow-300 dark:border-yellow-600/50 flex items-start">
                    <ExclamationIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" /> {/* Alterado de ExclamationTriangleIcon */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-200 mb-1">{t('remoteStorageHelp.connectionNotice.title')}</h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">{t('remoteStorageHelp.connectionNotice.content')}</p>
                    </div>
                  </section>

                </div>

                <div className="mt-5 sm:mt-6 flex justify-end pt-4 border-t dark:border-gray-700">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-150 shadow-sm"
                    onClick={closeModal}
                  >
                    {t('remoteStorageHelp.closeButton')}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RemoteStorageHelp;
