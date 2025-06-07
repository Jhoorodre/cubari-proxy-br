import React, { PureComponent } from "react";
import MangaCard from "../components/MangaCard";
import Container from "../components/Container";
import Section from "../components/Section";
import {
  globalHistoryHandler,
  purgePreviousCache,
} from "../utils/remotestorage";
import Spinner from "../components/Spinner";
import { sourceMap } from "../sources/Sources";
import { mangaUrlBuilder } from "../utils/compatability";
import ScrollableCarousel from "../components/ScrollableCarousel";
import { withTranslation } from 'react-i18next';

class HistoryClass extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      items: [],
      ready: false,
    };
  }

  updateItems = () => {
    return globalHistoryHandler.getAllUnpinnedSeries().then((items) => {
      if (this.ref.current) {
        this.setState({
          items,
          ready: true,
        });
      }
    });
  };

  componentDidMount = () => {
    this.props.setPath("History");
    purgePreviousCache();
    this.updateItems();
  };

  render() {
    const { t } = this.props;
    return (
      <Container>
        <Section
          text={t('historyPageTitle')}
          subText={t('historySubtext', { maxItems: globalHistoryHandler.max, currentCount: this.state.items.length })}
          ref={this.ref}
        ></Section>
        {this.state.ready ? (
          <ScrollableCarousel expandable={true} expanded={true}>
            {this.state.items.map((e) => (
              <MangaCard
                key={`history-${e.timestamp}-${e.slug}-${e.source}`}
                mangaUrlizer={mangaUrlBuilder(e.url)}
                slug={e.slug}
                coverUrl={e.coverUrl}
                mangaTitle={e.title}
                sourceName={e.source}
                source={sourceMap[e.source]}
                showRemoveFromHistory={true}
                storageCallback={this.updateItems}
              ></MangaCard>
            ))}
          </ScrollableCarousel>
        ) : (
          <Spinner />
        )}
      </Container>
    );
  }
}

export default withTranslation()(HistoryClass);
