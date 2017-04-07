import { Component, OnInit } from '@angular/core';
import { ArticleService, Article, ArticlesResponse } from '@freescan/skeleton';


@Component({
    selector:    'pstudio-articles',
    templateUrl: './articles.component.html',
    styleUrls:   ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
    public _articles: Article[];

    constructor(private articles: ArticleService) {
    }

    public ngOnInit(): void {
        this.articles.all().subscribe(
            (response: ArticlesResponse) => this._articles = response.data,
            (error: string) => console.error(error),
        );
    }
}
