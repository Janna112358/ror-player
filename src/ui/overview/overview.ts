import $ from "jquery";
import { stopAllPlayers } from "../../services/player";
import Vue from "vue";
import Component from "vue-class-component";
import WithRender from "./overview.vue";
import { Watch } from "vue-property-decorator";
import Compose from "../compose/compose";
import Listen from "../listen/listen";
import events, { MultipleHandlers, registerMultipleHandlers } from "../../services/events";
import "./overview.scss";
import { StateProvider } from "../../services/history";
import Help from "../help/help";
import Update from "../update/update";

@WithRender
@Component({
	components: { Compose, Listen, StateProvider, Help, Update }
})
export default class Overview extends Vue {
	activeTab = 0;

	_unregisterHandlers!: () => void;

	created() {
		this._unregisterHandlers = registerMultipleHandlers({
			listen() {
				this.activeTab = 0;
			},
			compose() {
				this.activeTab = 1;
			},
			"overview-close-pattern-list": function() {
				$("body").removeClass("bb-pattern-list-visible");
			}
		}, this);
	}

	beforeDestroy() {
		this._unregisterHandlers();
	}

	@Watch("activeTab")
	onActiveTabChange(activeTab: number) {
		stopAllPlayers();
		events.$emit(activeTab == 1 ? "overview-compose" : "overview-listen");
	}

	togglePatternList() {
		$("body").toggleClass("bb-pattern-list-visible");
	}

}