import React, { Fragment, PureComponent } from "react";
import { ChatIcon } from "@heroicons/react/outline";
import { Popover, Transition } from "@headlessui/react";
import Section from "./Section";
import { classNames } from "../utils/strings";
import { useTranslation } from 'react-i18next';

const BLACKHOLE_URL = "https://guya.moe/api/black_hole_mail/";

class BlackholeMailClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      submitted: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      textValue: e.target.value,
    });
  };

  handleKeyPress = (e) => {
    const { t } = this.props;
    if (e.key === "Enter" && this.state.textValue) {
      this.setState(
        {
          submitted: true,
        },
        () => {
          const payload = new URLSearchParams();
          payload.append("text", this.state.textValue);
          fetch(BLACKHOLE_URL, {
            method: "POST",
            body: payload,
          })
            .then((e) => e.json())
            .then((e) => {
              this.setState({
                textValue:
                  (e.success && t('blackholeSuccess')) ||
                  (e.error && t('blackholeError')) ||
                  t('blackholeNoResponse'),
              });
            })
            .catch(() => {
              this.setState({
                textValue: t('blackholeError'),
              });
            });
        }
      );
    }
  };

  render() {
    const { t } = this.props;
    return (
      <Popover as={Fragment}>
        {({ open }) => (
          <div className="relative mr-4">
            <Popover.Button
              as="button"
              className={classNames(
                "p-1 rounded-full bg-transparent text-black relative focus:outline-none",
                open
                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-black dark:text-gray-300"
              )}
            >
              <ChatIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Popover.Panel
                focus={true}
                className="absolute z-40 w-screen max-w-xl px-4 transform -right-24 sm:px-0 pointer-events-none"
              >
                <div className="ml-8 overflow-hidden mt-6 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4 text-black dark:text-white bg-gray-100 dark:bg-gray-800 pointer-events-auto">
                    <Section
                      text={t('blackholeTitle')}
                      textSize="text-2xl"
                      subText={t('blackholeSubtitle')}
                      subTextSize="text-sm"
                    ></Section>
                    <input
                      className={classNames(
                        "w-full mt-8 p-4 text-md bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none shadow-md",
                        this.state.submitted
                          ? "text-gray-500 dark:text-gray-500 user select-none"
                          : "text-black dark:text-white"
                      )}
                      onChange={this.handleChange}
                      onKeyPress={this.handleKeyPress}
                      type="text"
                      value={this.state.textValue}
                      placeholder={t('blackholePlaceholder')}
                      disabled={this.state.submitted}
                    />
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </div>
        )}
      </Popover>
    );
  }
}

const BlackholeMail = (props) => {
  const { t } = useTranslation();
  return <BlackholeMailClass {...props} t={t} />;
};

export default BlackholeMail;
