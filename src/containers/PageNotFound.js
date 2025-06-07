import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import Container from "../components/Container";
import Section from "../components/Section";

class PageNotFound extends PureComponent {
  render() {
    const { t } = this.props;
    return (
      <Container>
        <Section
          text={t("pageNotFound")}
          subText={t("pageNotFoundSubtext")}
        ></Section>
      </Container>
    );
  }
}

export default withTranslation()(PageNotFound);
