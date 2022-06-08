import React from 'react'
import Modell from './model/Shopping'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import SortierDialog from "./components/SortierDialog";


/**
 * @version 1.0
 * @author Alfred Walther <alfred.walther@syntax-institut.de>
 * @description Diese App ist eine Einkaufsliste mit React.js und separatem Model, welche Offline verwendet werden kann
 * @license Gnu Public Lesser License 3.0
 *
 */


class App extends React.Component {
    constructor(props) {
        super(props)
        this.initialisieren()
        this.state = {
            aktiveGruppe: null,
            showGruppenDialog: false,
            showSortierDialog: false,
            einkaufenAufgeklappt: true,
            erledigtAufgeklappt: false
        }
    }

    componentDidMount() {
        Modell.laden()
        // Auf-/Zu-Klapp-Zustand aus dem LocalStorage laden
        let einkaufenAufgeklappt = localStorage.getItem("einkaufenAufgeklappt")
        einkaufenAufgeklappt = (einkaufenAufgeklappt == null) ? true : JSON.parse(einkaufenAufgeklappt)

        let erledigtAufgeklappt = localStorage.getItem("erledigtAufgeklappt")
        erledigtAufgeklappt = (erledigtAufgeklappt == null) ? false : JSON.parse(erledigtAufgeklappt)

        this.setState({
            aktiveGruppe: Modell.aktiveGruppe,
            einkaufenAufgeklappt: einkaufenAufgeklappt,
            erledigtAufgeklappt: erledigtAufgeklappt
        })
    }

    initialisieren() {
        let Aufbau = Modell.gruppeHinzufuegen("Aufbauspiele")
        let Aufbau2 = Aufbau.artikelHinzufuegen("Total War Warhammer")
        Aufbau2.gekauft = true
        let Aufbau3 = Aufbau.artikelHinzufuegen("Total War Warhammer 3")
        Aufbau3.gekauft = false
        let Aufbau4 = Aufbau.artikelHinzufuegen("Total War Three Kindoms Royal Edition")
        Aufbau4.gekauft = false
        let Aufbau5 = Aufbau.artikelHinzufuegen("Total War A Troy Saga")
        Aufbau5.gekauft = false
        Aufbau.artikelHinzufuegen("Total War Warhammer 2 + DLC´s")
        let Horror = Modell.gruppeHinzufuegen("Horrorgames")
        let Horror2 = Horror.artikelHinzufuegen("Dreadout 2")
        Horror2.gekauft = false
        let Horror3 = Horror.artikelHinzufuegen("Dreadout")
        Horror3.gekauft = true
        let Horror4 = Horror.artikelHinzufuegen("Song of Horror Complete Edition")
        Horror4.gekauft = false
        let Horror5 = Horror.artikelHinzufuegen("Remothered Tormented Fathers")
        Horror5.gekauft = false
        let game2 = Horror.artikelHinzufuegen("Elden Ring")
        game2.gekauft = true
        Horror.artikelHinzufuegen("Visage")
        let Soulslike = Modell.gruppeHinzufuegen("Soulslikegames")
        let game3 = Soulslike.artikelHinzufuegen("Nioh")
        game3.gekauft = true
        Soulslike.artikelHinzufuegen("Nioh 2")
        let Soulslike2 = Soulslike.artikelHinzufuegen("Darksouls Remastered")
        Soulslike2.gekauft = true
        let Soulslike3 = Soulslike.artikelHinzufuegen("Darksouls 2")
        Soulslike3.gekauft = true
        let Soulslike4 = Soulslike.artikelHinzufuegen("Darksouls 3")
        Soulslike4.gekauft = true
        let Soulslike5 = Soulslike.artikelHinzufuegen("Immortal Unchained")
        Soulslike5.gekauft = false
        let Soulslike6 = Soulslike.artikelHinzufuegen("Salt and Santuary")
        Soulslike6.gekauft = false
    }


    einkaufenAufZuKlappen() {
        const neuerZustand = !this.state.einkaufenAufgeklappt
        localStorage.setItem("einkaufenAufgeklappt", neuerZustand)
        this.setState({einkaufenAufgeklappt: neuerZustand})
    }

    erledigtAufZuKlappen() {
        const neuerZustand = !this.state.erledigtAufgeklappt
        localStorage.setItem("erledigtAufgeklappt", neuerZustand)
        this.setState({erledigtAufgeklappt: neuerZustand})
    }

    lsLoeschen() {
        if (window.confirm("Wollen Sie wirklich alles löschen?!")) {
            localStorage.clear()
        }
    }

    /**
     * Hakt einen Artikel ab oder reaktiviert ihn
     * @param {Artikel} artikel - der aktuelle Artikel, der gerade abgehakt oder reaktiviert wird
     */

    artikelChecken = (artikel) => {
        artikel.gekauft = !artikel.gekauft
        const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
        Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
        this.setState(this.state)
    }

    artikelHinzufuegen() {
        const eingabe = document.getElementById("artikelEingabe")
        const artikelName = eingabe.value.trim()
        if (artikelName.length > 0) {
            Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
            this.setState(this.state)
        }
        eingabe.value = ""
        eingabe.focus()
    }

    setAktiveGruppe(gruppe) {
        Modell.aktiveGruppe = gruppe
        Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
        this.setState({aktiveGruppe: Modell.aktiveGruppe})
    }

    closeSortierDialog = (reihenfolge, sortieren) => {
        if (sortieren) {
            Modell.sortieren(reihenfolge)
        }
        this.setState({showSortierDialog: false})
    }

    render() {
        let nochZuKaufen = []
        if (this.state.einkaufenAufgeklappt == true) {
            for (const gruppe of Modell.gruppenListe) {
                nochZuKaufen.push(
                    <GruppenTag
                        key={gruppe.id}
                        aktiv={gruppe == this.state.aktiveGruppe}
                        aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
                        checkHandler={this.artikelChecken}
                        gekauft={false}
                        gruppe={gruppe}
                    />)
            }
        }

        let schonGekauft = []
        if (this.state.erledigtAufgeklappt) {
            for (const gruppe of Modell.gruppenListe) {
                schonGekauft.push(
                    <GruppenTag
                        key={gruppe.id}
                        aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
                        checkHandler={this.artikelChecken}
                        gekauft={true}
                        gruppe={gruppe}
                    />)
            }
        }

        let gruppenDialog = ""
        if (this.state.showGruppenDialog) {
            gruppenDialog = <GruppenDialog
                gruppenListe={Modell.gruppenListe}
                onDialogClose={() => this.setState({showGruppenDialog: false})}/>
        }

        let sortierDialog = ""
        if (this.state.showSortierDialog) {
            sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
        }

        return (
            <div id="container">
                <header>
                    <h1>Einkaufsliste</h1>
                    <label
                        className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
                        <span className="mdc-text-field__ripple"></span>
                        <input className="mdc-text-field__input" type="search"
                               id="artikelEingabe" placeholder="Artikel hinzufügen"
                               onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
                        <span className="mdc-line-ripple"></span>
                        <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                           tabIndex="0" role="button"
                           onClick={() => this.artikelHinzufuegen()}>add_circle</i>
                    </label>
                </header>
                <hr/>
                <main>
                    <section>
                        <h2>Noch zu kaufen
                            <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
                            </i>
                        </h2>
                        <dl>
                            {nochZuKaufen}
                        </dl>
                    </section>
                    <hr/>
                    <section>
                        <h2>Schon gekauft
                            <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
                            </i>
                        </h2>
                        <dl>
                            {schonGekauft}
                        </dl>
                    </section>
                </main>
                <hr/>
                <footer>
                    <button className="mdc-button mdc-button--raised"
                            onClick={() => this.setState({showGruppenDialog: true})}>
                        <span className="material-icons">bookmark_add</span>
                        <span className="mdc-button__ripple"></span> Gruppen
                    </button>
                    <button className="mdc-button mdc-button--raised"
                            onClick={() => this.setState({showSortierDialog: true})}>
                        <span className="material-icons">sort</span>
                        <span className="mdc-button__ripple"></span> Sort
                    </button>
                    <button className="mdc-button mdc-button--raised"
                            onClick={this.lsLoeschen}>
                        <span className="material-icons">clear_all</span>
                        <span className="mdc-button__ripple"></span> Clear
                    </button>
                </footer>

                {gruppenDialog}
                {sortierDialog}

            </div>
        )
    }
}

export default App
