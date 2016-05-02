package ILMT::Translator;
use strict;
use warnings;
use Dir::Self;
use Data::Dumper;
use Exporter qw(import);
use Module::Pluggable::Object;
use Module::Runtime qw(use_module);

our @EXPORT_OK = qw(get_translator get_langpairs);

my %translator_table;

sub new_translator {
    my $class = shift;
    my $self = {
        src => shift,
        tgt => shift,
    };

    my $search_path = "ILMT::$self->{src}::$self->{tgt}";

    @{$self->{plugins}} = map use_module($_),
                            grep /^${search_path}::[^:]+$/,
                              Module::Pluggable::Object->new(search_path => $search_path)->plugins;

    $self->{seq} = shift;

    bless $self, $class;

    # Register this module as a translator service
    $translator_table{$self->{src}}{$self->{tgt}} = $self;

    return $self;
}

sub get_translator {
    my ($src, $tgt) = @_;
    return $translator_table{$src}{$tgt};
}

sub get_langpairs {
    return map +(lc $_ => [ map lc, keys %{$translator_table{$_}} ]), keys %translator_table;
}

sub translate {
    my ($self, %args) = @_;
    my $result = "";
    my @identifiers;
    my %final_result;
    my @dispatch_seq = @{$self->{seq}};
    foreach my $index (0 .. $#dispatch_seq) {
        my $module = $dispatch_seq[$index ++];
        my $identifier = lc("${module}-$index");
        push @identifiers, $identifier;
        my $package = "ILMT::$self->{src}::$self->{tgt}::$module";
        $args{$identifier} = $package->can('process')->(%args);
        $args{'data'} = $args{$identifier};
    }
    @final_result{@identifiers} = @args{@identifiers};
    return \%final_result;
}

sub partial_p {
    my ($self, $start, $end, %args) = @_;
    my $result = "";
    my @dispatch_seq = @{$self->{seq}};
    my @identifiers;
    my %final_result;
    foreach my $index ($start .. $end) {
        my $module = $dispatch_seq[$index - 1];
        my $identifier = lc("${module}-$index");
        push @identifiers, $identifier;
        my $package = "ILMT::$self->{src}::$self->{tgt}::$module";
        $args{$identifier} = $package->can('process')->(%args);
        $args{'data'} = $args{$identifier};
    }
    @final_result{@identifiers} = @args{@identifiers};
    return \%final_result;
}

1;
