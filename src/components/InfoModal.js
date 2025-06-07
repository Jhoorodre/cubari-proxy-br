import React, { PureComponent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import Section from "./Section";
import Container from "./Container";
import { useTranslation, Trans } from 'react-i18next';

// Should probably be a build var but fuck itttttt
const DISCORD_INVITE = "https://discord.gg/wwD2xTbQxe";

// We'll throw these up here since they're replaced at build time anyway
const CHANGELOG_KEY = "changelog";
const CHANGELOG_SERIES = []; // Definido como array vazio para evitar erros

class InfoModalClass extends PureComponent {
  state = {
    isOpen: false,
    changeAvailable: false,
  };

  setIsOpen = (open) => {
    return () => {
      if (CHANGELOG_SERIES.length > 0) {
        localStorage.setItem(CHANGELOG_KEY, CHANGELOG_SERIES[0].abbrevHash);
      }
      this.setState({ isOpen: open, changeAvailable: false });
    };
  };

  componentDidMount = () => {
    const lastItem = localStorage.getItem(CHANGELOG_KEY);
    if (CHANGELOG_SERIES.length > 0 && (!lastItem || lastItem !== CHANGELOG_SERIES[0].abbrevHash)) {
      this.setState({
        changeAvailable: true,
      });
    }
  };

  render() {
    const { t } = this.props;
    return (
      <button
        className="p-1 relative rounded-full bg-transparent text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none"
        onClick={this.setIsOpen(true)}
      >
        {this.state.changeAvailable ? (
          <Fragment>
            <span className="animate-ping absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 dark:bg-red-600 rounded-full"></span>
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 dark:bg-red-600 rounded-full"></span>
          </Fragment>
        ) : undefined}
        <InformationCircleIcon className="h-6 w-6" aria-hidden="true" />

        <Transition appear show={this.state.isOpen} as={Fragment}>
          <Dialog
            open={this.state.isOpen ? true : false}
            onClose={this.setIsOpen(false)}
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              <Dialog.Overlay className="fixed inset-0" />
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="text-black dark:text-white inline-block bg-gray-100 dark:bg-gray-800 w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                  {/* Ugly wrapper thing for now I guess? */}
                  <div className="-mt-2">
                    <Section text={t('aboutTitle')} />
                    <Container>
                      <Dialog.Description>
                        <Trans i18nKey="aboutDescription">
                          <a className="text-blue-500 hover:text-blue-600" href="https://cubari.moe/">cubari.moe</a>
                        </Trans>
                      </Dialog.Description>
                    </Container>
                    <Section text={t('creditsTitle')} />
                    <Container>
                      <Dialog.Description>
                        <Trans i18nKey="creditsDescription">
                          <a className="text-blue-500 hover:text-blue-600" href="https://paperback.moe/">Confira o aplicativo se você usa iOS.</a>
                        </Trans>
                      </Dialog.Description>
                    </Container>
                    <Section text={t('discordTitle')} />
                    <Container>
                      <Dialog.Description>
                        <Trans i18nKey="discordDescription">
                          <a className="text-blue-500 hover:text-blue-600" href={DISCORD_INVITE}>entre no nosso Discord.</a>
                        </Trans>
                      </Dialog.Description>
                    </Container>
                  </div>
                  <button
                    className="mt-10 bg-transparent text-black hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={this.setIsOpen(false)}
                  >
                    {t('coolButton')}
                  </button>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </button>
    );
  }
}

const InfoModal = (props) => {
  const { t } = useTranslation();
  return <InfoModalClass {...props} t={t} />;
};

export default InfoModal;
