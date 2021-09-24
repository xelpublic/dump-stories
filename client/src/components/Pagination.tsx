import React from 'react';


interface IProps {
    pageCount: number;
    selectedPage: number;
    onSelectPage: (page: number) => void;
}

const currentPageIndent = 1;

enum PaginationAction {
    firstPage = 'firstPage',
    prevPage = 'prevPage',
    prevPageScope = 'prevPageScope',
    goToPage = 'goToPage',
    nextPageScope = 'nextPageScope',
    nextPage = 'nextPage',
    lastPage = 'lastPage'
}

class Pagination extends React.Component<IProps>  {

    constructor(props: IProps | Readonly<IProps>) {
        super(props);
        this.state = { selectedPage: 1 };
        // console.log('Pagination constructor')
    }

    getPages = () => {

        const page = this.props.selectedPage;
        const pageCount = this.props.pageCount;
        const pages = []

        const pageScopeStart = page - currentPageIndent > 1 ? page - currentPageIndent : 1
        const pageScopeEnd = page + currentPageIndent < pageCount ? page + currentPageIndent : pageCount

        pages.push({
            action: PaginationAction.prevPage,
            pageNum: page > 1 ? page - 1 : -1
        })

        if (pageScopeStart > 1) {
            pages.push({
                action: PaginationAction.prevPageScope,
                pageNum: pageScopeStart - currentPageIndent > 0 ? pageScopeStart - currentPageIndent : 1
            })
        }

        for (let i = pageScopeStart; i <= pageScopeEnd; i++) {
            pages.push({
                action: PaginationAction.goToPage,
                pageNum: i
            })
        }

        if (pageScopeEnd < pageCount) {
            pages.push({
                action: PaginationAction.nextPageScope,
                pageNum: pageScopeEnd + currentPageIndent < pageCount ? pageScopeEnd + currentPageIndent : pageCount
            })
        }

        pages.push({
            action: PaginationAction.nextPage,
            pageNum: page < pageCount ? page + 1 : -1
        })

        return pages;
    }

    setSelectedPage = (page: number) => {
        // console.log('setSelectedPage ', page)
        this.props.onSelectPage(page);
    }


    render() {
        const page = this.props.selectedPage;
        // console.log('render page=', page)

        return (
            <>
                <ul className="pagination">
                    {
                        this.getPages().map((goPage, index, arr) => {

                            switch (goPage.action) {
                                case PaginationAction.prevPage:
                                    return (
                                        goPage.pageNum > 0 ?
                                            <li key={'pagination' + index}
                                                className="waves-effect">
                                                <a href="#!"
                                                    onClick={() => this.setSelectedPage(goPage.pageNum)}
                                                >
                                                    <i className="material-icons">chevron_left</i>
                                                </a>
                                            </li> :
                                            <li key={'pagination' + index}
                                                className="disabled">
                                                <a href="#!">
                                                    <i className="material-icons">chevron_left</i>
                                                </a>
                                            </li>
                                    )
                                case PaginationAction.prevPageScope:
                                    return (
                                        <li key={'pagination' + index}
                                            className="waves-effect">
                                            <a href="#!"
                                                onClick={() => this.setSelectedPage(goPage.pageNum)}
                                            >...</a>
                                        </li>
                                    )
                                case PaginationAction.goToPage:
                                    if (goPage.pageNum === page) {
                                        return (
                                            <li key={'pagination' + index}
                                                className="active waves-effect">
                                                <a href="#!">{goPage.pageNum}</a>
                                            </li>
                                        )
                                    }
                                    return (
                                        <li key={'pagination' + index}
                                            className="waves-effect">
                                            <a href="#!"
                                                onClick={() => this.setSelectedPage(goPage.pageNum)}
                                            >{goPage.pageNum}</a>
                                        </li>
                                    )
                                case PaginationAction.nextPageScope:
                                    return (
                                        <li key={'pagination' + index}
                                            className="waves-effect">
                                            <a href="#!"
                                                onClick={() => this.setSelectedPage(goPage.pageNum)}
                                            >...</a>
                                        </li>
                                    )
                                case PaginationAction.nextPage:
                                    return (
                                        goPage.pageNum > 0 ?
                                            <li key={'pagination' + index}
                                                className="waves-effect">
                                                <a href="#!"
                                                    onClick={() => this.setSelectedPage(goPage.pageNum)}
                                                >
                                                    <i className="material-icons">chevron_right</i>
                                                </a>
                                            </li> :
                                            <li key={'pagination' + index}
                                                className="disabled waves-effect">
                                                <a href="#">
                                                    <i className="material-icons">chevron_right</i>
                                                </a>
                                            </li>
                                    )
                            }
                        })
                    }
                </ul>
            </>
        )
    }
}

export default Pagination;