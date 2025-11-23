'use client';

import { useState, useEffect } from 'react';
import { FileText, Filter, Download, Shield, ShieldOff, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import type { AccessLogResponseDTO } from '@/lib/types';

export function AccessLogsViewer() {
    const [logs, setLogs] = useState<AccessLogResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterAuthorized, setFilterAuthorized] = useState<'all' | 'yes' | 'no'>('all');
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'all'>('today');

    useEffect(() => {
        loadLogs();
    }, [dateRange]);

    const loadLogs = async () => {
        setIsLoading(true);
        try {
            let data: AccessLogResponseDTO[];

            if (dateRange === 'today') {
                data = await api.getTodayAccesses();
            } else if (dateRange === 'week') {
                const end = new Date().toISOString();
                const start = new Date();
                start.setDate(start.getDate() - 7);
                data = await api.getAccessLogs(start.toISOString(), end);
            } else {
                data = await api.getAccessLogs();
            }

            setLogs(data);
            toast.success(`${data.length} registros cargados`);
        } catch (error: any) {
            toast.error('Error al cargar logs', { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        if (filterAuthorized === 'yes') return log.authorized;
        if (filterAuthorized === 'no') return !log.authorized;
        return true;
    });

    const exportToCSEV = () => {
        const headers = ['ID', 'Fecha/Hora', 'UID Tarjeta', 'Persona', 'Cargo', 'Tipo Acceso', 'Autorizado', 'Ubicación'];
        const rows = filteredLogs.map(log => [
            log.id,
            new Date(log.accessTime).toLocaleString(),
            log.cardUid,
            log.personName || 'N/A',
            log.cargo || 'N/A',
            log.accessType,
            log.authorized ? 'Sí' : 'No',
            log.location || 'N/A',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `access-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast.success('Logs exportados correctamente');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                        Registros de Acceso
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Historial de accesos con tarjetas RFID
                    </p>
                </div>

                <button
                    onClick={exportToCSEV}
                    disabled={filteredLogs.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-5 h-5" />
                    Exportar CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as any)}
                        className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="today">Hoy</option>
                        <option value="week">Última Semana</option>
                        <option value="all">Todos</option>
                    </select>
                </div>

                {/* Authorization Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select
                        value={filterAuthorized}
                        onChange={(e) => setFilterAuthorized(e.target.value as any)}
                        className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">Todos los accesos</option>
                        <option value="yes">Solo Autorizados</option>
                        <option value="no">Solo Denegados</option>
                    </select>
                </div>

                <button
                    onClick={loadLogs}
                    disabled={isLoading}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Cargando...' : 'Refrescar'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
                    <div className="text-orange-400 text-sm font-medium">Total Accesos</div>
                    <div className="text-3xl font-bold text-orange-500 mt-1">{logs.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-medium">Autorizados</div>
                    <div className="text-3xl font-bold text-green-500 mt-1">
                        {logs.filter(l => l.authorized).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
                    <div className="text-red-400 text-sm font-medium">Denegados</div>
                    <div className="text-3xl font-bold text-red-500 mt-1">
                        {logs.filter(l => !l.authorized).length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium">Filtrados</div>
                    <div className="text-3xl font-bold text-blue-500 mt-1">{filteredLogs.length}</div>
                </div>
            </div>

            {/* Logs Table */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-muted-foreground mt-4">Cargando registros...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium text-muted-foreground">
                        No hay registros de acceso
                    </p>
                    <p className="text-muted-foreground mt-2">
                        Los registros aparecerán cuando se usen las tarjetas RFID
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha/Hora</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">UID Tarjeta</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Persona</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Cargo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Autorizado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className={`hover:bg-muted/30 transition-colors ${!log.authorized ? 'bg-red-500/5' : ''}`}>
                                        <td className="px-6 py-4 text-sm">
                                            <div>{new Date(log.accessTime).toLocaleDateString()}</div>
                                            <div className="text-muted-foreground text-xs">
                                                {new Date(log.accessTime).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm">{log.cardUid}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium">{log.personName || 'Desconocido'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {log.cargo || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {log.accessType}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {log.authorized ? (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                    <Shield className="w-3 h-3" />
                                                    Sí
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                    <ShieldOff className="w-3 h-3" />
                                                    No
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {log.location || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
