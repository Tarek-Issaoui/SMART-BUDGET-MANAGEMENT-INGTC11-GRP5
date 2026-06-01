import { useState, useEffect } from "react";
import { Plus, Trash2, Users, UserPlus, UserMinus, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/ui/Modal";
import { LabeledInput, LabeledSelect } from "../components/ui/Input";
import type { Groupe, MembreGroupe, User } from "../data/types";
import { groupesApi, utilisateursApi } from "../services/api";

export function Groups() {
  const { groups, budgets, transactions, addGroup, deleteGroup } = useApp();
  const [addModal, setAddModal] = useState(false);
  const [nom, setNom] = useState("");
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  // detail / member management
  const [detail, setDetail] = useState<Groupe | null>(null);
  const [membres, setMembres] = useState<MembreGroupe[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"editeur" | "lecteur">("lecteur");
  const [memberLoading, setMemberLoading] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [groupMembres, setGroupMembres] = useState<Record<number, MembreGroupe[]>>({});

  // Load all users once
  useEffect(() => {
    utilisateursApi.getAll().then(setAllUsers).catch(() => {});
  }, []);

  const openDetail = async (g: Groupe) => {
    setDetail(g);
    const m = await groupesApi.getMembres(g.id);
    setMembres(m);
  };

  const toggleExpand = async (gid: number) => {
    if (expandedGroup === gid) { setExpandedGroup(null); return; }
    setExpandedGroup(gid);
    if (!groupMembres[gid]) {
      const m = await groupesApi.getMembres(gid);
      setGroupMembres(prev => ({ ...prev, [gid]: m }));
    }
  };

  const handleAddGroup = async () => {
    if (!nom.trim()) return;
    await addGroup(nom.trim());
    setNom(""); setAddModal(false);
  };

  const handleAddMember = async () => {
    if (!selectedUserId || !detail) return;
    setMemberLoading(true);
    try {
      const m = await groupesApi.addMembre(detail.id, {
        utilisateur_id: Number(selectedUserId),
        role: selectedRole,
      });
      setMembres(prev => [...prev, m]);
      setGroupMembres(prev => ({ ...prev, [detail.id]: [...(prev[detail.id] ?? []), m] }));
      setAddMemberModal(false);
      setSelectedUserId("");
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "Erreur lors de l'ajout");
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (utilisateurId: number) => {
    if (!detail) return;
    try {
      await groupesApi.removeMembre(detail.id, utilisateurId);
      setMembres(prev => prev.filter(m => m.utilisateur_id !== utilisateurId));
      setGroupMembres(prev => ({
        ...prev,
        [detail.id]: (prev[detail.id] ?? []).filter(m => m.utilisateur_id !== utilisateurId),
      }));
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "Erreur lors de la suppression");
    }
  };

  const getUserName = (uid: number) =>
    allUsers.find(u => u.id === uid)?.nom_utilisateur ?? `#${uid}`;

  const roleLabel: Record<string, string> = {
    proprietaire: "Propriétaire",
    editeur: "Éditeur",
    lecteur: "Lecteur",
  };

  const roleBadgeColor: Record<string, string> = {
    proprietaire: "bg-purple-100 text-purple-800",
    editeur: "bg-blue-100 text-blue-800",
    lecteur: "bg-gray-100 text-gray-700",
  };

  // Users not yet in the group
  const availableUsers = allUsers.filter(
    u => !membres.some(m => m.utilisateur_id === u.id)
  );

  const groupBudgets = (gid: number) => budgets.filter(b => b.groupe_id === gid);
  const groupTx = (gid: number) => transactions.filter(t => t.groupe_id === gid);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Groupes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{groups.length} groupes actifs</p>
        </div>
        <button onClick={() => { setNom(""); setAddModal(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Nouveau groupe
        </button>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(g => {
          const bCount = groupBudgets(g.id).length;
          const tCount = groupTx(g.id).length;
          const isExpanded = expandedGroup === g.id;
          const gMembres = groupMembres[g.id] ?? [];

          return (
            <div key={g.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{g.nom}</p>
                    <p className="text-muted-foreground text-xs">{g.cree_le.split("T")[0]}</p>
                  </div>
                </div>
                <button onClick={() => setDelConfirm(g.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border mb-3">
                <div className="text-center">
                  <p className="text-primary font-mono">{bCount}</p>
                  <p className="text-xs text-muted-foreground">Budget(s)</p>
                </div>
                <div className="text-center">
                  <p className="text-primary font-mono">{tCount}</p>
                  <p className="text-xs text-muted-foreground">Transaction(s)</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => openDetail(g)}
                  className="flex-1 py-2 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                  Gérer les membres
                </button>
                <button onClick={() => toggleExpand(g.id)}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-1">
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>

              {/* Inline member list */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                  {gMembres.length === 0
                    ? <p className="text-xs text-muted-foreground">Aucun membre chargé</p>
                    : gMembres.map(m => (
                      <div key={m.utilisateur_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                            {getUserName(m.utilisateur_id).slice(0, 1).toUpperCase()}
                          </div>
                          <span className="text-xs text-foreground">{getUserName(m.utilisateur_id)}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeColor[m.role]}`}>
                          {roleLabel[m.role]}
                        </span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          );
        })}
        {groups.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-3 text-center py-10">Aucun groupe</p>
        )}
      </div>

      {/* Add group modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Nouveau groupe">
        <div className="space-y-4">
          <LabeledInput label="Nom du groupe" value={nom} onChange={e => setNom(e.target.value)} placeholder="ex. Famille Issaoui" />
          <div className="flex gap-3 pt-1">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Annuler</button>
            <button onClick={handleAddGroup} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">Créer</button>
          </div>
        </div>
      </Modal>

      {/* Member management modal */}
      {detail && (
        <Modal open={!!detail} onClose={() => setDetail(null)} title={`Membres — ${detail.nom}`} size="lg">
          <div className="space-y-4">
            {/* Member list */}
            <div className="space-y-2">
              {membres.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">Aucun membre</p>
              )}
              {membres.map(m => (
                <div key={m.utilisateur_id}
                  className="flex items-center justify-between px-3 py-2.5 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs flex-shrink-0">
                      {getUserName(m.utilisateur_id).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{getUserName(m.utilisateur_id)}</p>
                      <p className="text-xs text-muted-foreground">
                        {allUsers.find(u => u.id === m.utilisateur_id)?.email ?? ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadgeColor[m.role]}`}>
                      {roleLabel[m.role]}
                    </span>
                    {m.role !== "proprietaire" && (
                      <button onClick={() => handleRemoveMember(m.utilisateur_id)}
                        className="p-1.5 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors"
                        title="Retirer du groupe">
                        <UserMinus size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add member button */}
            <button onClick={() => { setSelectedUserId(""); setSelectedRole("lecteur"); setAddMemberModal(true); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-primary/40 rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors">
              <UserPlus size={15} /> Ajouter un membre
            </button>
          </div>
        </Modal>
      )}

      {/* Add member sub-modal */}
      <Modal open={addMemberModal} onClose={() => setAddMemberModal(false)} title="Ajouter un membre" size="sm">
        <div className="space-y-4">
          <LabeledSelect label="Utilisateur" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>{u.nom_utilisateur} ({u.email})</option>
            ))}
          </LabeledSelect>
          <LabeledSelect label="Rôle" value={selectedRole} onChange={e => setSelectedRole(e.target.value as "editeur" | "lecteur")}>
            <option value="editeur">Éditeur</option>
            <option value="lecteur">Lecteur</option>
          </LabeledSelect>
          {availableUsers.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Tous les utilisateurs sont déjà membres</p>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setAddMemberModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Annuler</button>
            <button onClick={handleAddMember} disabled={!selectedUserId || memberLoading}
              className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-60">
              {memberLoading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={delConfirm !== null} onClose={() => setDelConfirm(null)} title="Supprimer le groupe" size="sm">
        <p className="text-muted-foreground text-sm mb-5">Supprimer ce groupe ? Les budgets et transactions liés ne seront pas supprimés.</p>
        <div className="flex gap-3">
          <button onClick={() => setDelConfirm(null)} className="flex-1 py-2 border border-border rounded-lg text-sm">Annuler</button>
          <button onClick={async () => { await deleteGroup(delConfirm!); setDelConfirm(null); }}
            className="flex-1 py-2 bg-destructive text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
