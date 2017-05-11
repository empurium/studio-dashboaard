import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import {
    AlertService,
    Tier,
    TierService,
    TierResource,
    TierResourceService,
} from '@freescan/skeleton';


@Component({
    selector:      'pstudio-tier-resource',
    templateUrl:   './tier-resource.component.html',
})
export class TierResourceComponent implements OnInit {
    @Input() public referenceId: string;
    @Input() public ambitious: boolean = true;
    @Input() public storeEvent: EventEmitter<Tier|null> = new EventEmitter();
    @Output() public changed: EventEmitter<Tier|null> = new EventEmitter();
    public tierResources: TierResource[] = [];
    public tiers: Tier[];
    public tierId: string;
    public saving: boolean = false;

    constructor(private alerts: AlertService,
                private tierService: TierService,
                private tierResourceService: TierResourceService) {
    }

    public ngOnInit(): void {
        this.loadTiers();
        this.load();

        this.storeEvent.subscribe((tier: Tier|null) => this.store(tier));
    }

    /**
     * Request the tiers for this white label so they can assign resources to them.
     */
    public loadTiers(): void {
        this.tierService
            .all()
            .subscribe(
                (tiers: Tier[]) => {
                    this.tiers = tiers;
                    this.selectCurrent();
                },
                (error: string) => {},
            );
    }

    /**
     * Request the Tier Resource for a given reference identifier.
     */
    public load(): void {
        if (!this.referenceId) {
            return;
        }

        this.tierResourceService
            .for(this.referenceId)
            .subscribe(
                (tierResources: TierResource[]) => {
                    this.tierResources = tierResources;
                    this.selectCurrent();
                },
                (error: string) => {
                    // May not be any tier resources for this reference identifier
                },
            );
    }

    /**
     * Form calls this method to store the tier resource, but it
     * will not execute if the ambitious option is used.
     */
    public formStore(tierId: string): void {
        let tier: Tier | null = this.getTier();

        if (!this.ambitious) {
            this.changed.emit(tier);
            return;
        }

        this.store(tier);
    }

    /**
     * Save to the server.
     * Deletes Tier Resources if marked Free, otherwise creates.
     * TODO - Support more than one active Tier. Perhaps check boxes.
     */
    public store(tier: Tier): void {
        this.saving = true;

        if (tier === null) {
            this.free();
            return;
        }

        if (!tier) {
            this.alerts.error(null, 'Could not locate payment tier.');
            return;
        }

        if (!this.tierResources || !this.tierResources.length) {
            this.post(tier);
            return;
        }
    }

    /**
     * Create the Tier Resources for this reference identifier.
     */
    private post(tier: Tier): void {
        this.tierResourceService
            .post(tier, this.referenceId)
            .finally(() => this.saving = false)
            .subscribe(
                (response: TierResource): void => {
                    this.tierResources.push(response);
                    this.changed.emit(tier);
                    this.alerts.success(null, `Saved to ${tier.name} payment tier.`);
                },
                (error: any): void => {
                    this.alerts.error(null, `Could not save to ${tier.name} payment tier!`);
                },
            );
    }

    /**
     * Delete all existing Tier Resources on this reference identifier.
     */
    private free(): void {
        _.each(this.tierResources, (tierResource: TierResource) => {
            this.tierResourceService
                .delete(tierResource)
                .subscribe(
                    () => {
                        this.saving = false;
                        this.alerts.warning(null, 'Removed from payment tier.');
                    },
                    (error: any): void => {
                        this.alerts.errorMessage(error);
                    },
                );
        });

        if (!this.tierResources) {
            this.saving = false;
        }

        this.tierResources = [];
        this.changed.emit(null);
    }

    /**
     * Get the Tier by Tier ID.
     */
    private getTier(): Tier | null {
        let tier: Tier = _.find(this.tiers, { id: this.tierId });
        return tier ? tier : null;
    }

    /**
     * Select the Tier based on the Tier Resources this reference identifier is assigned to.
     */
    private selectCurrent(): void {
        let tierId: any = _.get(_.first(this.tierResources), 'tier.data.id');
        let tier: Tier  = _.find(this.tiers, { id: tierId });

        this.tierId = tier ? tier.id : '';
        this.changed.emit(tier);
    }
}
